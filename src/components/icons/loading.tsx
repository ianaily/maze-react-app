import { SvgPropsTypes } from './types';

export const IconLoading: React.FC<SvgPropsTypes> = (props) => (
  <svg width="24px" height="24px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" {...props}>
    <rect x="19.5" y="19.5" width="30" height="30" fill="#455161">
      <animate
        attributeName="fill"
        values="#668996;#455161;#455161"
        keyTimes="0;0.25;1"
        dur="1s"
        repeatCount="indefinite"
        begin="0s"
        calcMode="discrete"
      />
    </rect>
    <rect x="50.5" y="19.5" width="30" height="30" fill="#455161">
      <animate
        attributeName="fill"
        values="#668996;#455161;#455161"
        keyTimes="0;0.25;1"
        dur="1s"
        repeatCount="indefinite"
        begin="0.25s"
        calcMode="discrete"
      />
    </rect>
    <rect x="19.5" y="50.5" width="30" height="30" fill="#455161">
      <animate
        attributeName="fill"
        values="#668996;#455161;#455161"
        keyTimes="0;0.25;1"
        dur="1s"
        repeatCount="indefinite"
        begin="0.75s"
        calcMode="discrete"
      />
    </rect>
    <rect x="50.5" y="50.5" width="30" height="30" fill="#455161">
      <animate
        attributeName="fill"
        values="#668996;#455161;#455161"
        keyTimes="0;0.25;1"
        dur="1s"
        repeatCount="indefinite"
        begin="0.5s"
        calcMode="discrete"
      />
    </rect>
  </svg>
);
