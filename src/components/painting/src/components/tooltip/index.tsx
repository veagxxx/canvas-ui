import { defineComponent, nextTick, ref, Teleport, watch, PropType } from "vue";
import { debounce } from '../../utils/func';
import './tooltip.css'
const Tooltip = defineComponent({
  name: 'Tooltip',
  props: {
    effect: {
      type: String as PropType<'dark' | 'light'>,
      default: 'light',
    },
    content: {
      type: String,
    },
    trigger: {
      type: String,
      default: 'hover'
    }
  },
  setup(props, { slots }) {
    const show = ref(false);
    const wrapperRef = ref();
    const popper = ref();
    const popperArrow = ref();
    const expectState = ref(false);
    const timeout = ref<any>(null);
    
    watch(show, () => {
      if (show.value) {
        nextTick(() => {
          const tooltipDom = popper.value;
          const arrowDom = popperArrow.value;
          const left = tooltipDom.offsetWidth / 2 - arrowDom.offsetWidth * Math.sin(45 * Math.PI / 180);
          arrowDom.style.transform = `translate3d(${left}px, 0, 0)`
        });
      }
    })

    const handleMouseEnter = () => {
      if (props.trigger === 'hover') {
        show.value = true;
        nextTick(resetPosition);
      }
    }
    const onShow = () => {
      setExpectedState(true);
      handleMouseEnter();
    }

    const onHide = () => {
      setExpectedState(false);
      debounce(handleClosePopper, 200)();
    }

    const handleMouseLeave = () => {
      debounce(handleClosePopper, 200)();
    }

    const handleClosePopper = () => {
      if (expectState.value) return;
      
      if (timeout) {
        clearTimeout(timeout.value);
      }

      if (props.trigger === 'hover') {
        show.value = false;
      }
    }

    const handleClick = () => {
      if (props.trigger === 'click') {
        show.value = !show.value
        if (show.value) {
          nextTick(resetPosition);
        }
      }
    }
    const setExpectedState = (state: boolean) => {
      if (expectState.value === false) {
        clearTimeout(timeout.value);
      }
      expectState.value = state;
    }

    const resetPosition = () => {
      const $popper = popper.value;
      const $wrapper = wrapperRef.value;
      if ($popper) {
        const left = $wrapper.offsetLeft - ($popper.offsetWidth - $wrapper.offsetWidth) / 2;
        const top = $wrapper.offsetTop + $wrapper.offsetHeight * 1.5;
        $popper.style.top = top + 'px';
        $popper.style.left = left + 'px';
      }
    }
    return () => (
      <div 
        ref={ wrapperRef }
        class="tooltip" 
        onClick={ handleClick }
        onMouseenter={ handleMouseEnter } 
        onMouseleave={ handleMouseLeave } 
      >
        { slots.default?.() }
        { show.value && (
          <Teleport to="body">
            <div 
              ref={ popper }
              class={ `tooltip-popper is-${props.effect}` } 
              onMouseenter={ onShow }
              onMouseleave={ onHide }
            >
              { props.content }
              { slots.content?.() }
              <div class="popper-arrow" ref={ popperArrow }></div>
            </div>
          </Teleport>
        ) }
      </div>
    )
  }
});

export default Tooltip;