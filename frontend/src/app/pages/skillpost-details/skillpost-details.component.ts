import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-skillpost-details',
  imports: [],
  templateUrl: './skillpost-details.component.html',
  styleUrl: './skillpost-details.component.css',
})
export class SkillpostDetailsComponent {
  constructor(public route: ActivatedRoute) {}
  public id: string | null = null;
  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('postId');
  }
}
