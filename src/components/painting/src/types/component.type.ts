import { Graphic } from './shape';
import { ExtractPropTypes } from "vue";
import type { PropType } from 'vue';

export const PaintingProps = {
  width: {
    type: [Number, String],
  },
  height: {
    type: [Number, String],
  },
  toolbars: {
    type: Array as PropType<Array<string>>,
  },
  shapes: {
    type: Array as PropType<Array<Graphic>>,
  },
  themeColor: {
    type: String as PropType<string>
  }
}

export type PaintingPropsType = ExtractPropTypes<typeof PaintingProps>; 