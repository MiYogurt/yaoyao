<script>
// EI -> editor input
import EIText from "./Text.vue";
import EISelect from "./Select.vue";
import EIRadio from "./Radio.vue";
import EITextArea from "./TextArea.vue";
import { mapObjIndexed, values } from "ramda";
export default {
  name: "config-layer-box",
  components: {
    EIText,
    EISelect,
    EIRadio,
    EITextArea
  },
  props: ['config', 'fire', 'close','source'],
  render(h) {
    const { config, fire, source, close } = this;
    const buildForms = () => {
      return mapObjIndexed((conf, key) => {
        const Tag = "EI" + conf.inputType.slice(0,1).toUpperCase() + conf.inputType.slice(1);
        const select = conf.select;
        let childProps = {
          label: config[key].label,
          name: key,
          fire,
          value: source[key] || config[key].default
        };

        if (conf.inputType == "select" || conf.inputType == "radio") {
          childProps.select = select;
        }
        return <Tag {...{props: childProps}} />;
      }, config);
    };
    return <div class="config-layer">
        <i class="fas fa-times" onClick={close}></i>
        {values(buildForms())}
      </div>;
  }
};
</script>


<style lang="stylus" scoped>
.config-layer {
    width 400px;
    height 100vh;
    z-index 99;
    background #1b2331;
    padding 2rem 1rem
    position fixed
    right 0
    top 0
    i {
      position absolute
      top 20px
      right 20px
      cursor pointer
      color rgba(226, 78, 78, .86)
    }
}
</style>

