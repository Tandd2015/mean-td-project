import { Directive, ElementRef, Renderer2, HostListener } from '@angular/core';

@Directive({
  selector: '[appDynamicFontSize]'
})
export class DynamicFontSizeDirective {

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  @HostListener('input', ['$event.target'])
  onInput(textArea: HTMLTextAreaElement): void {
    this.adjustFontSize(textArea);
  }

  ngAfterViewInit(): void {
    this.adjustFontSize(this.el.nativeElement);
  }

  private adjustFontSize(element: HTMLElement): void {
    const textLength = element.textContent!.length;
    const minFontSize = 2;
    const maxFontSize = 5;

    const fontSize = Math.min(maxFontSize, Math.max(minFontSize, 10 / textLength!));
    this.renderer.setStyle(element, 'font-size', fontSize + 'vw');
  }

}
