import { Drawer } from './Drawer';
import { Modal } from './Modal';
import { Popconfirm } from './Popconfirm';
import { Popover } from './Popover';

export const PopActions = Popconfirm as typeof Popconfirm & {
  Popover: typeof Popover;
  Popconfirm: typeof Popconfirm;
  Modal: typeof Modal;
  Drawer: typeof Drawer;
};

PopActions.Drawer = Drawer;
PopActions.Modal = Modal;
PopActions.Popconfirm = Popconfirm;
PopActions.Popover = Popover;
