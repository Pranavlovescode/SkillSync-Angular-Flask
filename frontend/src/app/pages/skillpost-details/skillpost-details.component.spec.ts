import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillpostDetailsComponent } from './skillpost-details.component';

describe('SkillpostDetailsComponent', () => {
  let component: SkillpostDetailsComponent;
  let fixture: ComponentFixture<SkillpostDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkillpostDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkillpostDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
