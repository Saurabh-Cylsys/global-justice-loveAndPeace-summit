import { Component, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-news-paper',
  templateUrl: './news-paper.component.html',
  styleUrls: ['./news-paper.component.css'],
  animations: [
    trigger('fadeIn', [
      state('void', style({
        opacity: 0
      })),
      transition(':enter', [
        animate('0.7s ease-in', style({
          opacity: 1
        }))
      ])
    ]),
    trigger('scaleIn', [
      state('void', style({
        transform: 'scale(0.9)',
        opacity: 0
      })),
      transition(':enter', [
        animate('0.5s ease-out', style({
          transform: 'scale(1)',
          opacity: 1
        }))
      ])
    ]),
    trigger('hoverEffect', [
      state('normal', style({
        transform: 'scale(1)',
        boxShadow: 'none'
      })),
      state('hovered', style({
        transform: 'scale(1.05)',
        boxShadow: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)'
      })),
      transition('normal <=> hovered', [
        animate('0.3s ease-in-out')
      ])
    ]),
    trigger('staggeredFade', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(15px)' }),
          stagger('200ms', [
            animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class NewsPaperComponent implements OnInit {
  imageStates: { [key: string]: string } = {
    'newspaper1': 'normal',
    'newspaper2': 'normal',
    'newspaper3': 'normal',
    'newspaper4': 'normal'
  };
  
  imagesLoaded = false;

  ngOnInit() {
    // Simulate loading delay for demonstration purposes
    setTimeout(() => {
      this.imagesLoaded = true;
    }, 300);
  }

  onMouseEnter(image: string) {
    this.imageStates[image] = 'hovered';
  }

  onMouseLeave(image: string) {
    this.imageStates[image] = 'normal';
  }
}
