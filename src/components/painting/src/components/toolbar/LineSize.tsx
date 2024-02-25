import { SetupContext } from 'vue';
import '../../style/line-size.css';
interface Props {
  lineSize: number;
  sizes: number[];
  onLineSize?: (line: number) => void;
}
export default (props: Props, { emit }: SetupContext) => {
  const { lineSize, sizes } = props;
  const setLineStyle = (size: number) => {
    return { height: `${size}px`, flex: 1 };
  }
  return (
    <div class="line-list">
      {sizes.map(line => {
        return (
          <div 
            class={ `line-item ${lineSize === line ? 'line-selected' : ''}` } 
            onClick={() => emit('line-size', line)}
          >
            <span>{ line }像素：</span>
            <div class={`line-item-${line}`} style={setLineStyle(line)}></div>
          </div>
        )
      })}
    </div>
  )
}