import {
  transition,
  trigger,
  style,
  animate,
  state,
  stagger,
  keyframes,
  query
} from '@angular/animations';

export const SlideDownTrigger = trigger('slideDown', [
  transition(':enter', [
    style({
      transform: 'translateY(-100%)'
    }),
    animate(
      '300ms ease-out',
      style({
        transform: 'translateY(0)'
      })
    )
  ]),
  transition(':leave', [
    style({
      transform: 'translateY(0)'
    }),
    animate(
      '300ms ease-in',
      style({
        transform: 'translateY(-100%)'
      })
    )
  ]) /* #007bff */
]);

export const ListStateTrigger = trigger('listState', [
  transition('* => *', [
    query(
      ':enter',
      [
        style({
          opacity: 0,
          transform: 'translateX(-100%)'
        }),
        stagger(200, [
          animate(
            '500ms ease-out',
            keyframes([
              style({
                opacity: 0.7,
                transform: 'translateX(15%)',
                offset: 0.7
              }),
              style({
                opacity: 1,
                transform: 'translateX(0)',
                offset: 1
              })
            ])
          )
        ])
      ],
      { optional: true }
    ),
    query(
      ':leave',
      [
        animate(
          '500ms ease-in',
          keyframes([
            style({
              opacity: 1,
              transform: 'translateX(0)'
            }),
            style({
              opacity: 0.7,
              transform: 'translateX(-15%)'
            }),
            style({
              opacity: 0,
              transform: 'translateX(100%)'
            })
          ])
        )
      ],
      { optional: true }
    )
  ])
]);

export const ItemStateTrigger = trigger('itemState', [
  transition(':leave', [
    animate(
      '500ms ease-in',
      keyframes([
        style({
          opacity: 1,
          transform: 'translateX(0)'
        }),
        style({
          opacity: 0.7,
          transform: 'translateX(-15%)'
        }),
        style({
          opacity: 0,
          transform: 'translateX(100%)'
        })
      ])
    )
  ]),

  transition('slidUp => slidDown', [
    style({
      transform: 'translateY(-100%)'
    }),
    animate(
      '300ms ease-out',
      style({
        transform: 'translateY(0)'
      })
    ),
    transition('slidDown => slidUp', [
      style({
        transform: 'translateY(0)'
      }),
      animate(
        '300ms ease-in',
        style({
          transform: 'translateY(-100%)'
        })
      )
    ])
  ])
]);

export const markedTrigger = trigger('markedState', [
  state(
    'default',
    style({
      backgroundColor: 'transparent'
    })
  ),
  state(
    'marked',
    style({
      border: '2px solid #007bff',
      boxShadow: '2px 2px 1px #007bff',
      backgroundColor: '#caeff9'
    })
  ),
  transition('default => marked', [
    query(
      '.card',
      animate(
        '200ms ease-out',
        style({
          transform: 'scale(1.05)',
          backgroundColor: '#D2FFFE'
        })
      )
    )
    /*   style({
        border: '2px solid black',
        padding: '19px'
      }),
      animate('200ms ease-out', style({
        transform: 'scale(1.05)'
      })),
      animate(200)  */
  ]),

  transition('marked => default', [
    style({
      border: '2px solid #D2FFFE'
    }),
    animate('300ms ease-out')
  ])
]);
