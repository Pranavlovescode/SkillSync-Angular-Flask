import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillpostsComponent } from './skillposts.component';

describe('SkillpostsComponent', () => {
  let component: SkillpostsComponent;
  let fixture: ComponentFixture<SkillpostsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkillpostsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkillpostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
