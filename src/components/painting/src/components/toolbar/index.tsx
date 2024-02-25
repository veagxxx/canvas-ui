import { defineComponent } from "vue";
import type { PropType } from 'vue';
import Tooltip from "../tooltip";
import SvgIcon from "../svg-icon";
import LineSize from "./LineSize";
import Shape from "./shape";
import '../../style/toolbar.css';
const NAME = 'toolbar';
const sizesMap = {
  brush: [1, 2, 3, 4],
  default: [1, 3, 5, 8]
}
export default defineComponent({
  name: NAME,
  props: {
    toolbars: {
      type: Array as PropType<Array<string>>,
      required: true
    },
    shape: String,
    spikes: Number,
    lineSize: {
      type: Number,
      default: 3
    },
    sizes: {
      type: Array as PropType<Array<number>>,
      default: () => sizesMap.default
    },
    fill: Boolean,
    color: {
      type: String,
      default: '#000000'
    },
    canRevoke: Boolean,
    canNext: Boolean,
  },
  emits: ['shape', 'color', 'fill', 'lineSize', 'revoke', 'next', 'save', 'download'],
  setup(props, { emit }) {
    const { toolbars } = props;
    // select a shape
    const onShape = (shape: string, spikes?: number) => {
      emit('shape', shape, spikes ?? 0);
    }
    // pick color
    const onColorChange = (event: Event) => {
      emit('color', (event.target as HTMLInputElement).value);
    }
    // using fill color
    const useFill = () => {
      emit('fill', true);
    }

    const onLineSize = (value: number) => {
      emit('lineSize', value);
    }

    const setClass = (shape: string | boolean | undefined) => {
      return {
        'toolbar-item': true,
        selected: !!shape
      }
    }

    const setStyle = () => {
      if (props.canRevoke) {
        return {};
      } else {
        return 
      }
    }

    return () => (
      <>{ 
        toolbars.map((tool: string, index: number) => {
          switch(tool) {
            case '-':
              return (
                <div class="toolbar-item__divider"></div>
              )
            case 'shape':
              return (
                <Tooltip 
                  trigger="hover" 
                  effect="light"
                  v-slots={{
                    content: () => (
                      <Shape 
                        shape={ props.shape } 
                        spikes={ props.spikes}  
                        onShape={ onShape }
                      ></Shape>
                    ),
                  }}
                >
                  <div class={ setClass(props.shape && props.shape !== 'brush') } title="图形">
                    <SvgIcon iconClass="shape"></SvgIcon>
                  </div>
                </Tooltip>
              )
            case 'lineSize':
              return (
                <Tooltip trigger="hover">
                  {{
                    content: () => (
                      <LineSize 
                        sizes={ props.sizes } 
                        lineSize={ props.lineSize }
                        onLineSize={ onLineSize }
                      ></LineSize>
                    ),
                    default: () => (
                      <div class="toolbar-item" title="线条粗细">
                        <SvgIcon iconClass="line-size"></SvgIcon>
                      </div>
                    )
                  }}
                </Tooltip>
              )
            case 'brush':
              return (
                <div 
                  class={ setClass(props.shape == 'brush') } 
                  title="画笔" 
                  onClick={ () => onShape(tool) }
                >
                  <SvgIcon icon-class="brush"></SvgIcon>
                </div>
              )
            case 'fill':
              return (
                <div class={ setClass(props.fill) }
                  title="填充" 
                  onClick={ useFill }
                >
                  <SvgIcon icon-class="fill"></SvgIcon>
                </div>
              )
            case 'color':
              return (
                <div class="toolbar-item" title="颜色">
                  <input 
                    type="color" 
                    value={ props.color } 
                    onInput={ (e: Event) => onColorChange(e) }
                  />
                </div>
              )
            case 'revoke':
              return (
                <div 
                  class="toolbar-item" 
                  title="撤销" 
                  onClick={ () => emit('revoke') } 
                  v-merge-class={{ 'is-disabled': !props.canRevoke }}
                >
                  <SvgIcon icon-class="revoke"></SvgIcon>
                </div>
              )
            case 'next':
              return (
                <div 
                  class="toolbar-item" 
                  title="重做" 
                  onClick={ () => emit('next') }
                  v-merge-class={{ 'is-disabled': !props.canNext }}
                >
                  <SvgIcon icon-class="next"></SvgIcon>
                </div>
              )
            case 'save':
              return (
                <div class="toolbar-item" title="保存" onClick={ () => emit('save') }>
                  <SvgIcon icon-class="save"></SvgIcon>
                </div>
              )
            case 'download':
              return (
                <div class="toolbar-item" title="下载" onClick={ () => emit('download') }>
                  <SvgIcon icon-class="download"></SvgIcon>
                </div>
              )
            default:
              return;
          }
        }) 
      }</>
    )
  },
});

