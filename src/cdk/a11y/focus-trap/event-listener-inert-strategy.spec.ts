import {AfterViewInit, Component, ElementRef, Type, ViewChild} from '@angular/core';
import {ComponentFixture, fakeAsync, flush, TestBed} from '@angular/core/testing';
import {
  A11yModule,
  ConfigurableFocusTrapFactory,
  ConfigurableFocusTrap,
  EventListenerFocusTrapInertStrategy,
  FOCUS_TRAP_INERT_STRATEGY,
} from '../index';


describe('EventListenerFocusTrapInertStrategy', () => {
  const providers = [
    {provide: FOCUS_TRAP_INERT_STRATEGY, useValue: new EventListenerFocusTrapInertStrategy()}];

  it('refocuses the first FocusTrap element when focus moves outside the FocusTrap',
    fakeAsync(() => {
      const fixture = createComponent(SimpleFocusTrap, providers);
      const componentInstance = fixture.componentInstance;
      fixture.detectChanges();

      componentInstance.outsideFocusableElement.nativeElement.focus();
      flush();

      expect(document.activeElement).toBe(
        componentInstance.firstFocusableElement.nativeElement,
        'Expected first focusable element to be focused');
  }));

  it('does not intercept focus when focus moves to another element in the FocusTrap',
    fakeAsync(() => {
      const fixture = createComponent(SimpleFocusTrap, providers);
      const componentInstance = fixture.componentInstance;
      fixture.detectChanges();

      componentInstance.secondFocusableElement.nativeElement.focus();
      flush();

      expect(document.activeElement).toBe(
        componentInstance.secondFocusableElement.nativeElement,
        'Expected second focusable element to be focused');
  }));
});

function createComponent<T>(componentType: Type<T>, providers: Array<Object> = []
  ): ComponentFixture<T> {
    TestBed.configureTestingModule({
      imports: [A11yModule],
      declarations: [componentType],
      providers: providers
    }).compileComponents();

    return TestBed.createComponent<T>(componentType);
  }

@Component({
  template: `
    <textarea #outsideFocusable></textarea>
    <div #focusTrapElement>
      <input #firstFocusable>
      <button #secondFocusable>SAVE</button>
    </div>
    `
})
class SimpleFocusTrap implements AfterViewInit {
  @ViewChild('focusTrapElement') focusTrapElement!: ElementRef;
  @ViewChild('outsideFocusable') outsideFocusableElement!: ElementRef;
  @ViewChild('firstFocusable') firstFocusableElement!: ElementRef;
  @ViewChild('secondFocusable') secondFocusableElement!: ElementRef;

  focusTrap: ConfigurableFocusTrap;

  constructor(private _focusTrapFactory: ConfigurableFocusTrapFactory) {
  }

  ngAfterViewInit() {
    this.focusTrap = this._focusTrapFactory.create(this.focusTrapElement.nativeElement);
    this.focusTrap.focusFirstTabbableElementWhenReady();
  }
}
