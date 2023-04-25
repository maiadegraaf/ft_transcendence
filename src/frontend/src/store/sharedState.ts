import { ref} from 'vue';
import MessageList from '../components/Chat/MessageList.vue';
import type {Component} from 'vue';

interface SharedState {
    currentComponent: Component;
}

const state: SharedState = {
    currentComponent: ref(MessageList),
};

export default state;