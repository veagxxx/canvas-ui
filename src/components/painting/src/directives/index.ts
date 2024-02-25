import { App } from "vue";
import { mergeClass } from './class.directive';

// 自定义指令
export default (app: App) => {
  mergeClass(app);
};