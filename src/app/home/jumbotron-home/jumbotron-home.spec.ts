import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JumbotronHome } from './jumbotron-home';

describe('JumbotronHome', () => {
  let component: JumbotronHome;
  let fixture: ComponentFixture<JumbotronHome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JumbotronHome]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JumbotronHome);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
