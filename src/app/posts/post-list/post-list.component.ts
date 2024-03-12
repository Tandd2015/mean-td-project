import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { Post } from '../../models';
import { PostService } from '../../services/post.service';
@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  public postsMixedListErrors: string[] = [];

  public postsGoogle: Array<Post> = [];
  @Output() postsGoogleEvent: EventEmitter<Array<Post>> = new EventEmitter<Array<Post>>();
  public postsGoogleSubscription: Subscription = new Subscription();
  public post: Post = new Post();
  public posterLink: string = 'https://www.google.com/maps/place/Terry+Dockery+Investigations+and+Security+Services/@41.0972585,-84.2647399,17z/data=!3m1!4b1!4m5!3m4!1s0x883e808771a44aa7:0x769d0e746c737a97!8m2!3d41.0972545!4d-84.2625512?hl=en-US';

  public autoSlidePostStopperGoogle: boolean = true;
  @Output() autoSlidePostStopperGoogleEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    private readonly postService: PostService,
  ) { }

  ngOnInit(): void {
    this.onGetGooglePosts();
  }

  public onGetGooglePosts(): void {
    this.postsGoogleSubscription = this.postService.getGooglePosts()
      .subscribe({
        next: (postsGoogle) => {
          this.postsGoogle = postsGoogle;
          if (this.postsGoogle.length === 0) {
            this.postsGoogleSubscription.unsubscribe();
            this.onGetGooglePosts();
          };
          this.postsGoogleEvent.emit(this.postsGoogle);
        },
        error: (error) => {
          this.handlePostErrors(error.error);
        },
      });
  };


  public stopAutoSlidePostGoogle(): void {
    this.autoSlidePostStopperGoogle = false;
  };

  public startAutoSlidePostGoogle(): void {
    this.autoSlidePostStopperGoogle = true;
  };


  private handlePostErrors(errors: string[] | string): void {
    this.postsMixedListErrors = Array.isArray(errors) ? errors : [errors];
  };

  ngOnDestroy(): void {
    this.postsGoogleEvent.unsubscribe();
    this.postsGoogleSubscription.unsubscribe();
  };
};
