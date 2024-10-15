import { create } from 'zustand';
import { createAuthSlice } from './Slice/AuthSlice';
import { createChatSlice } from './Slice/ChatSlice';

export const useAppStore = create()((...a)=>({
  ...createAuthSlice(...a),
  ...createChatSlice(...a)
  
}))