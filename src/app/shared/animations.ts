import { trigger, style, animate } from '@angular/animations';
import { transition, query } from '@angular/animations';

export const RouteFadeStateTrigger = trigger('fadeState', [
  transition(':enter', [
    style({
      opacity: 0
    }),
    animate(300)
  ]),
  transition(
    ':leave',
    animate(
      300,
      style({
        opacity: 0
      })
    )
  )
]);

export const routeSlideStateTrigger = trigger('slideState', [
  transition(':enter', [
    style({
      opacity: 0,
      transform: 'translateX(-100%)'
    }),
    animate(300)
  ]),
  transition(
    ':leave',
    animate(
      300,
      style({
        opacity: 0,
        transform: 'translateX(100%)'
      })
    )
  )
]);

export const routeMoveStateTrigger = trigger('moveState', [
  transition(':enter', [
    style({
      opacity: 0,
      transform: 'translateX(-100%)'
    }),
    animate('300ms ease-out', style({
      opacity: 0.6,
      transform: 'translateX(+20%)'
    }))
  ]),
  transition(
    ':leave',
    animate(
      300,
      style({
        opacity: 0,
        transform: 'translateX(100%)'
      })
    ),

  )
]);
