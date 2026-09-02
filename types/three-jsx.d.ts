import { ThreeElements } from '@react-three/fiber';

declare global {
  namespace JSX {
    interface IntrinsicElements extends ThreeElements {
      primitive: any;
      group: any;
      mesh: any;
      cylinderGeometry: any;
      meshStandardMaterial: any;
      torusGeometry: any;
      boxGeometry: any;
      sphereGeometry: any;
      planeGeometry: any;
      ambientLight: any;
      directionalLight: any;
      pointLight: any;
    }
  }
}

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements extends ThreeElements {
      primitive: any;
      group: any;
      mesh: any;
      cylinderGeometry: any;
      meshStandardMaterial: any;
      torusGeometry: any;
      boxGeometry: any;
      sphereGeometry: any;
      planeGeometry: any;
      ambientLight: any;
      directionalLight: any;
      pointLight: any;
    }
  }
}
