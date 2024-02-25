import { SetupContext } from 'vue';
import { Shape } from '../../enums/shape.enum';
import Spikes from './spikes';
import '../../style/shape.css';
import { getThemeColor } from '../../utils/func';
import Polygon from './polygon';
interface Props {
  shape?: string;
  spikes?: number;
  onShape?: (shape: string) => void;
}
export default (props: Props, { emit }: SetupContext) => {
  const defaultStyle = {
    stroke: '',
    strokeWidth: 1,
  }

  const strokeStyle = (value: string) => {
    return {
      stroke: props.shape === value ? 'var(--theme)' : ''
    }
  }
  const borderStyle = (value: string) => {
    return {
      borderColor: props.shape === value ? 'var(--theme)' : ''
    }
  }
  const setColor = (shape: string, spikes: number) => {
    const themeColor = getThemeColor();
    return props.shape === shape && spikes === props.spikes ? themeColor : '';
  }

  const spikes = [
    { angles: 4, title: '四角星' },
    { angles: 5, title: '五角星' },
    { angles: 6, title: '六角星' },
  ]

  const polygons = [
    { size: 4, title: '菱形', shape: 'polygon' },
    { size: 5, title: '五边形', shape: 'polygon' },
    { size: 6, title: '六边形', shape: 'polygon' },
  ]
  return (
    <div class="shape-list">
      <div title="直线" class="shape-item" onClick={ () => emit('shape', Shape.Line) }>
        <svg xmlns="http://www.w3.org/2000/svg">
          <polygon
            points="0,0 16,16"
            style={{ 
              ...defaultStyle, 
              ...strokeStyle(Shape.Line)
            }}
          ></polygon>
        </svg>
      </div>
      <div title="矩形" class="shape-item" onClick={ () => emit('shape', Shape.Rect) }>
        <div class="shape-rect" style={ borderStyle(Shape.Rect) }></div>
      </div>
      <div title="圆" class="shape-item" onClick={ () => emit('shape', Shape.Circle) }>
        <div class="shape-circle" style={ borderStyle(Shape.Circle) }></div>
      </div>
      <div title="椭圆" class="shape-item" onClick={ () => emit('shape', Shape.Ellipse) }>
        <div class="shape-ellipse" style={ borderStyle(Shape.Ellipse) }></div>
      </div>
      <div title="三角形" class="shape-item" onClick={ () => emit('shape', Shape.Triangle) }>
        <svg xmlns="http://www.w3.org/2000/svg">
          <polygon 
            points="8,0 0,16 16,16" 
            style={{ ...defaultStyle, ...strokeStyle(Shape.Triangle) }}
          ></polygon>
        </svg>
      </div>
      <div title="三角形" class="shape-item" onClick={ () => emit('shape', Shape.RightTriangle) }>
        <svg xmlns="http://www.w3.org/2000/svg">
          <polygon 
            points="0,0 0,16 16,16" 
            style={{ ...defaultStyle, ...strokeStyle(Shape.RightTriangle) }}
          ></polygon>
        </svg>
      </div>
      <div title="三角形" class="shape-item" onClick={ () => emit('shape', Shape.LeftTriangle) }>
        <svg xmlns="http://www.w3.org/2000/svg">
          <polygon 
            points="16,0 16,16 0,16" 
            style={{ ...defaultStyle, ...strokeStyle(Shape.LeftTriangle) }}
          ></polygon>
        </svg>
      </div>
      {polygons.map((item) => 
        <div 
          title={ item.title } 
          class="shape-item" 
          onClick={ () => emit('shape', Shape.Polygon, item.size) }
        >
          <Polygon polygon={ item.size } color={ setColor(Shape.Polygon, item.size) }/>
        </div>
      )}
      {spikes.map((item) => 
        <div 
          title={ item.title } 
          class="shape-item" 
          onClick={ () => emit('shape', Shape.SPIKES, item.angles) }
        >
          <Spikes spikes={ item.angles } color={ setColor(Shape.SPIKES, item.angles) }/>
        </div>
      )}
    </div>
  )
}