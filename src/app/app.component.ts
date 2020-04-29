import { Component, ViewChild, ViewContainerRef, ComponentFactory, OnInit, ComponentFactoryResolver, Injector, ViewRef } from '@angular/core';
import { WidgetComponent } from './widget.component';

@Component({
  selector: 'app-root',
  template: `<h1>Host View</h1>
               <div class="container">
                  <div class="row">
                    <div class="col line">
                      <h4>Left Column</h4>
                      <ng-container #leftContainer></ng-container>
                    </div>
                    <div class="col">
                    <h4>Right Column</h4>
                    <button class="btn btn-outline-primary" (click)="createWidget()">Create Widget</button>
                    <ng-container #rightContainer></ng-container>
                  </div>
                  </div>
               </div>
              `,
  styles: [`
  .line {
    border-right: 1px dashed black;
  }
  `]
})
export class AppComponent implements OnInit {
  @ViewChild('leftContainer',{read:ViewContainerRef}) leftContainer:ViewContainerRef;
  @ViewChild('rightContainer',{read:ViewContainerRef}) rightContainer:ViewContainerRef;

  private widgetFactory:ComponentFactory<WidgetComponent>;

  constructor(private componentFactoryResolver:ComponentFactoryResolver, private injector:Injector){}

  ngOnInit(){
    this.widgetFactory = this.componentFactoryResolver.resolveComponentFactory<WidgetComponent>(WidgetComponent);
  }

  createWidget(){
    const widgetComponent = this.widgetFactory.create(this.injector);
    const widgetHostView:ViewRef = this.rightContainer.insert(widgetComponent.hostView);

    widgetComponent.instance.title= "new widget";
    widgetComponent.instance.viewRef= widgetHostView;
    widgetComponent.instance.switchWidget = this.switch.bind(this)
  }

  switch(widget:WidgetComponent){
    const widgetViewRef:ViewRef = widget.viewRef;

    if(this.leftContainer.indexOf(widgetViewRef) >= 0 ){
      widget.viewRef = this.rightContainer.insert(
                                        this.leftContainer.detach(
                                        this.leftContainer.indexOf(widgetViewRef)));
    }
    if(this.rightContainer.indexOf(widgetViewRef) >= 0 ){
      widget.viewRef = this.leftContainer.insert(
                                      this.rightContainer.detach(
                                      this.rightContainer.indexOf(widgetViewRef)));
    }
  }
}
