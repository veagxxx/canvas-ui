import { App } from 'vue';
import Painting from './src/index';
import './src/assets/var.css';
import { Graphic } from './src/types';
import SvgIcon from './src/components/svg-icon';
import 'virtual:svg-icons-register';
import directives from './src/directives';
/* istanbul ignore next */
const install = function(app: App) {
  directives(app);
  app.component('SvgIcon', SvgIcon);
  app.component(Painting.name as string, Painting);
};

export default install;

export type Shape = Graphic;

