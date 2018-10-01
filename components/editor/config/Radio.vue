<template>
    <div>
        <h3 v-text="label"></h3>
        <template v-for="(conf) in select">
            <div :key="conf.key" 
                @click="binding(conf.key)" 
                :class="{'radio-item': true}">
                <input type="radio" 
                    :name="name" 
                    :id="conf.key"
                    :checked="value == conf.key"
                />
                <label :for="conf.key" class="circle"></label>
                <label :for="conf.key" v-text="conf.value"></label>
            </div>
        </template>
        
    </div>
</template>


<script>
    export default {
        name: 'edit-config-select',
        props: ['name', 'value', 'fire', 'select', 'label'],
        methods: {
            binding(newVal){
                this.fire(this.name, newVal)
            }
        }
    }
</script>

<style lang="stylus" scoped>
h3 {
    margin .5rem 0
    font-size .9rem
    color #49a8fc
}
.radio-item
    width 33%
    display inline-block
    margin .5rem 0

input[type="radio"]
  z-index: 1
  width: 1.2rem
  height: 1.5rem
  opacity: 0
  margin: -3px 4px
  position absolute
  ~ label:not(.circle)
    color #fff
    font-size .9rem
    position: relative;
    top: -1px;
    margin-left 3px
    user-select none
  + label.circle
    border-radius: 50%
    width: 1.2rem
    height: 1.2rem
    display: inline-block
    background: #fff
    margin: -3px 4px
    &:after
      content: ' '
      width: .6rem
      height: .6rem
      display: block
      margin: 5px 5px
      background: #44a8fe
      border-radius: 50%
      transition: transform cubic-bezier(0.68, -0.51, 0.46, 1.49) .3s
      transform-origin: center
      transform: scale(0)
  &:checked + label.circle:after
    transform: scale(1)
</style>
