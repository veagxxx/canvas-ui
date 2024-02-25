import { computed, defineComponent, useAttrs } from 'vue';
import '../../style/svg-icon.css';
interface Props {
  iconClass: string;
  className?: string;
  size?: 'large' | 'default' | 'small';
}
export default defineComponent({
  props: ['iconClass', 'className', 'size'],
  setup(props: Props) {
    const size = props.size || 'default';
    const svgClass = computed(() => {
      return {
        'svg-icon': true,
        [props.className || '']: props.className,
        [`svg-icon--${size}`]: size,
      }
    });
    const iconName = computed<string>(() => {
      return `#icon-${props.iconClass}`
    });
    const attrs = useAttrs();

    const iconStyle = {
      default: {
        width: '1em',
        height: '1em',
        fontSize: '1em',
      },
      small: {
        width: '0.75em',
        height: '0.75em',
        fontSize: '0.75em',
      },
      large: {
        width: '24px',
        height: '24px',
        fontSize: '24px',
      }
    }
    return () => (
      <svg class={ svgClass.value } aria-hidden="true" style={ iconStyle[size] }>
        <use id="line-path" xlinkHref={ iconName.value } path-length="1" />
      </svg>
    );
  }
  
});