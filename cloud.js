const User = Parse.Object.extend('User');
const Post = Parse.Object.extend('Post');
const Comment = Parse.Object.extend('Comment');
const Message = Parse.Object.extend('Message');
const ALog = Parse.Object.extend('ALog');

const { upyun, bucket, service } = require('./upyun')
const { getConfig , mail } = require('./mail')
const shortId = require('shortid')

const url = process.env.PRODUCTION_URL;


async function noticeUser(from, to, type, meta){
    let msg = new Message()
    let acl = new Parse.ACL()
    acl.setPublicWriteAccess(false)
    acl.setPublicReadAccess(false)
    acl.setReadAccess(to, true)
    acl.setWriteAccess(to, true)
    msg.set('from', from)
    msg.set('to', to)
    msg.set('type', type)
    msg.set('read', false)
    msg.set(type, meta)
    msg.setACL(acl)
    return await msg.save()
}

Parse.Cloud.define("img_sign", async function (req) {
    return upyun.sign.getHeaderSign(bucket, req.params.method, req.params.path)
});


Parse.Cloud.define("view_post", async function (req) {
    let id = req.params.id;
    let query = new Parse.Query(Post)
    query.equalTo('objectId', id)
    let post = await query.first({useMasterKey: true})
    if (!post) return null
    const view = post.get('view') + 1
    post.set('view', view)
    await post.save(null, { useMasterKey: true})
    return post
});

Parse.Cloud.define("post_comment", async function (req) {
    let {post_id, comment_id} = req.params
    let from_user_id = req.user.id
    let query = new Parse.Query(Post)
    query.equalTo('objectId', post_id)
    let post = await query.first({useMasterKey: true})
    if (!post) return null

    let comment = new Comment()
    comment.id = comment_id
    comment = await comment.fetch()
    post.add('comments', comment)
    post.set('lastupdate', new Date())
    console.log(post.get('author').id);
    let from = User.createWithoutData(from_user_id)
    let to = post.get('author')
    await noticeUser(from, to, 'comment', {
        title: post.get('title'),
        post_id: post.id,
        comment: comment.get('text')
    })
    await post.save(null, { useMasterKey: true})
    return post
});

Parse.Cloud.define("del_comment", async function (req) {
    let {post_id, comment_id} = req.params
    let user_id = req.user.id
    let query = new Parse.Query(Post)
    let isAdmin = await check_admin(user_id)
    query.equalTo('objectId', post_id)
    let post = await query.first({useMasterKey: true})
    if (!post) return null

    let comment = new Parse.Query(Comment)
    comment.equalTo('objectId', comment_id)
    comment = await comment.first()
    console.log(comment);
    if (comment.get('author').id != user_id || !isAdmin) {
        return '';
    }
    console.log(comment);
    post.remove('comments', comment)
    await post.save(null, { useMasterKey: true})
    return post
});

Parse.Cloud.define("check_admin", async function (req) {
    let id = req.user.id;
    if (!id) {
        return ''
    }
    const query = new Parse.Query(Parse.Role)
    const user = new Parse.Query(Parse.User)
    query.equalTo('name', 'Administrator')
    user.equalTo('objectId', id)
    query.matchesQuery('users', user)
    return await query.find({useMasterKey: true})
});

async function check_admin(id) {
    const query = new Parse.Query(Parse.Role)
    const user = new Parse.Query(Parse.User)
    query.equalTo('name', 'Administrator')
    user.equalTo('objectId', id)
    query.matchesQuery('users', user)
    return (await query.find({useMasterKey: true})).length > 0
}

Parse.Cloud.define("del_post_comments", async function (req) {
    let id = req.user.id;
    let post_id = req.params.id;
    let isAdmin = check_admin(id)
    const query = new Parse.Query(Post)
    query.equalTo('objectId', post_id)
    query.include('comments')
    query.include('author')
    let post = await query.first()
    if (post.get('author').id != id && !isAdmin) {
        const log = new ALog()        
        log.set('level', 3)
        log.set('user_id', id)
        log.set('msg', `疑似被攻击, 用户Id为 ${id} 的正在请求他无权删除的东西`)
        await log.save()
        return "no permition"
    }
    if (post && post.get('comments')) {
        return await Promise.all(post.get('comments').map(c => c.destroy({ useMasterKey: true })))
    }
    return 'no post'
});

Parse.Cloud.define('check_username', async (req) => {
    const username = req.params.username
    if (!username) {
        return {
            canUse: false
        }
    }
    const query = new Parse.Query(User);
    query.equalTo("username", username);
    let user = await query.first({useMasterKey: true})
    if (user) {
        return {
            canUse: false
        }
    }
    return {
        canUse: true
    }
})


Parse.Cloud.beforeDelete("Post", async function (request) {
    const id = request.user.id
    const post = request.object
    let isAdmin = check_admin(id)
    const log = new ALog()
    log.set('level', 1)
    log.set('user_id', id)
    log.set('admin', isAdmin ? true : false)
    log.set('msg', `用户Id为 ${id} 删除了文章`)
    log.set('title', post.get('title'))
    log.set('text', post.get('text'))
    await log.save()
});

Parse.Cloud.beforeFind("User", async function (request) {
    const user = request.object
    const avatar = user.get('avatar')
    user.set('avatar', 'http://52yaoyao.test.upcdn.net' + avatar)
    return user
});


async function newToken(user) {
    const token = shortId.generate()
    user.set("verifyToken", token);
    await user.save(null, {useMasterKey: true})
    return token
}

async function findUserById(id) {
    const q = new Parse.Query(User)
    q.equalTo('objectId', id)
    return await q.first({ useMasterKey: true })
}

async function findUserByEmail(email) {
    const q = new Parse.Query(User)
    q.equalTo("email", email);
    return await q.first({ useMasterKey: true })
}

Parse.Cloud.define("send_register", async function(req) {
    const {id, email} = req.params
    let user = null 
    if (id) {
        user = await findUserById(id)
    }else {
        user = await findUserByEmail(email);
    }
    if (!user) {
        throw new Parse.Error(101, "没有该用户");
    }
    const token = await newToken(user)
    try {
        const ret = await mail.sendMail(getConfig(user.get("email"), "激活账号邮件", "register", {
            link: url + '/hooks/register?token=' + token + '&user=' + user.id
        }));
        return 'success'
    } catch (error) {
        return error
    }
});

Parse.Cloud.define("send_password", async function(req) {
    const { id, email} = req.params
    let user = null
    if (id) {
        user = await findUserById(id)
    } else {
        user = await findUserByEmail(email);
    }
    if (!user) {
        throw new Parse.Error(101, "没有该用户");
    }
    const token = await newToken(user)
    try {
        return mail.sendMail(getConfig(user.get("email"), "找回密码邮件", "password", {
            link: url + '/hooks/password?token=' + token + '&user=' + user.id
        }));
    } catch (error) {
        throw new Parse.Error(101, error);
    }
});

Parse.Cloud.define("send_change", async function (req) {
    const { id, email } = req.params;
    let user = null
    if (id) {
        user = await findUserById(id)
    } else {
        user = await findUserByEmail(email);
    }
    if (!user) {
        throw new Parse.Error(101, "没有该用户");
    }
    const token = await newToken(user)
    try {
        return mail.sendMail(getConfig(user.get("email"), "修改邮件地址邮件", "change", {
            code: token
        }));
    } catch (error) {
        throw new Parse.Error(101, error.toString());
    }
});

Parse.Cloud.define("send_verify", async function(req) {
  const { id, password, email, verify, token } = req.params;
  const user = await findUserById(id);
  if (!user) {
      throw new Parse.Error(101, "没有该用户");
  }

  const private_token = user.get('verifyToken')
  if (private_token != token) {
      throw new Parse.Error(101, "token 不匹配");
  }

  if (password) {
      user.setPassword(password)
  }

  if (email) {
      user.setEmail(email)
  }

  if (verify) {
      user.set("emailVerified", true);
  }
  await newToken(user);
  return 'success'
});