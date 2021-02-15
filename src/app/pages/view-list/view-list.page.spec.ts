import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ViewListPage } from './view-list.page';

describe('ViewListPage', () => {
  let component: ViewListPage;
  let fixture: ComponentFixture<ViewListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ViewListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
