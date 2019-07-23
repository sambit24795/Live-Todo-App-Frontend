import { trigger, state, style, transition, group, animate, query } from '@angular/animations';


export const ButtonStateTrigger = trigger('buttonState', [

    transition('* => *' , [
        query('#btnSubmit', [
            animate(100, style({
                backgroundColor: 'green',
                transform: 'scale(1)'
            })),
            animate(200, style({
                transform: 'scale(1.1)',
                backgroundColor: 'green'
            })),
        ],{optional: true}),
    ])
]);

export const formStateTrigger = trigger('formState', [
    transition('* => *', [
        query('input.ng-invalid:focus,textarea.ng-invalid:focus ', [
            animate(300, style({
                backgroundColor: 'red',
            })),
            animate(200),
        ], {optional: true}) 
    ])
]);

export const checkedStateTrigger = trigger('checkedState', [

    transition('* => *' , [
        query('#formArrybtn', [
            animate(100, style({
                backgroundColor: '#17a2b8',
                transform: 'scale(1)'
            })),
            animate(200, style({
                transform: 'scale(1.2)',
                backgroundColor: '#17a2b8'
            })),
        ],{optional: true}),
    ])
]);
