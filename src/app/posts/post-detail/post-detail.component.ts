import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, switchMap, tap } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { PostApp } from '../../models';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.css']
})
export class PostDetailComponent implements OnInit, OnDestroy {

  public selectedPostEditErrors: string[] = [];
  public postOnSDlSubscription: Subscription = new Subscription();
  public postsOnSDlSubscription: Subscription = new Subscription();
  public postOnSDltSubscription: Subscription = new Subscription();
  public postOnSDl: PostApp = new PostApp();
  public postsOnSDl: Array<PostApp> = [];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly postService: PostService,
    private readonly router: Router
  ) { }

  ngOnInit(): void {
    this.postOnSDlSubscription = this.route.paramMap
      .pipe(
        map(params => params.get('id')),
        switchMap(id => this.postService.getPost(id as string)),
      )
      .subscribe({
        next: (postAppDetail) => {
          this.postOnSDl = postAppDetail;
          console.log(this.route, 'Start', this.postOnSDl, postAppDetail);
        },
        error: (error) => this.handlepostOnSDlErrors(error.error.message)
      });

    this.postsOnSDlSubscription = this.postService.getSitePosts()
      .subscribe({
        next: (detailPostsApp) => {
          this.postsOnSDl = detailPostsApp;
        },
        error: (error) => this.handlepostOnSDlErrors(error.error)
      });
  }


  public onEventOnSE(event: Event): void {
    console.log('Preventing Event default Propagation');
    event.stopPropagation();
  }

  public onDeleteOnSE(postOnSDlOnSite: PostApp): void {
    this.postOnSDltSubscription = this.postService.removePost(postOnSDlOnSite._id)
      .subscribe({
        next: (dEPost) => {
          console.log('Deleted Post ', dEPost);
          this.postsOnSDl = this.postsOnSDl.filter(
            dEPost => dEPost._id !== postOnSDlOnSite._id,
          );
          this.router.navigateByUrl('admin/dash');
        },
        error: (error) => this.handlepostOnSDlErrors(error.error),
      });
  }

  private handlepostOnSDlErrors(errors: string[] | string): void {
    this.selectedPostEditErrors = Array.isArray(errors) ? errors : [errors];
  }

  ngOnDestroy(): void {
    this.postOnSDlSubscription.unsubscribe();
    this.postsOnSDlSubscription.unsubscribe();
    this.postOnSDltSubscription.unsubscribe();
  }
}
