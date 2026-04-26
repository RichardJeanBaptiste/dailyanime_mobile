import { Dimensions } from "react-native";

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width; 
const PlaceholderImage = require('@/assets/images/anime_splash.jpg');
const loremIpsum = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sagittis purus nec nisl molestie, vitae rutrum dolor vestibulum. Aenean pretium facilisis metus. Aliquam justo justo, luctus porttitor imperdiet ut, eleifend ut ipsum. Vivamus ultricies rhoncus velit in faucibus. Suspendisse tempus scelerisque dui at congue. Morbi eu nulla justo. Vivamus vehicula augue a dolor fringilla venenatis non vitae nisi. Donec tempus dui eget libero fringilla imperdiet. Vivamus at elementum enim, in interdum ligula. Donec quis enim fermentum, tincidunt arcu at, eleifend purus.
Praesent quis ligula erat. Etiam accumsan efficitur risus non mattis. Proin cursus metus metus, at maximus urna lobortis sit amet. Nullam eu maximus tellus. Interdum et malesuada fames ac ante ipsum primis in faucibus. Morbi congue metus odio, ac facilisis dui pretium ac. Etiam consequat leo ut tellus dapibus, non vestibulum mauris ornare. In gravida efficitur odio ac ultrices. Fusce vestibulum erat libero, id consequat odio tempor et. Sed ligula odio, commodo nec ultricies eu, interdum eget turpis. Pellentesque sapien purus, sagittis porta sapien id, consequat luctus nisl. Ut at nisl at eros faucibus placerat.`


export default function useAppConstants() {
    return {
        SCREEN_HEIGHT,
        SCREEN_WIDTH,
        PlaceholderImage,
        loremIpsum
    }
}