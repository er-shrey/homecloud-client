import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RenameFOlderComponent } from './rename-folder.component';

describe('RenameFOlderComponent', () => {
  let component: RenameFOlderComponent;
  let fixture: ComponentFixture<RenameFOlderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RenameFOlderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RenameFOlderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
