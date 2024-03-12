import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PostApp, File } from '../models';
import { PostService } from '../services/post.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit, OnDestroy {
  public postsOnSListErrors: string[] = [];
  public postsOnSiSubscription: Subscription = new Subscription();
  public postsOnSiDSubscription: Subscription = new Subscription();
  public postsOnSi: Array<PostApp> = [];
  public selectedPostOnS: any = null;
  public message: string = '';

  constructor(
    private readonly postService: PostService,
    private readonly router: Router
  ) { }

  ngOnInit(): void {
    this.postsOnSiSubscription = this.postService.getSitePosts()
    .subscribe({
      next: (postR) => {
        this.postsOnSi = postR;
      },
      error: (error) => this.handlePostOnSErrors(error.error),
    });
  }

  public onGetSitePostsOnS(): void {
    this.postService.getSitePosts()
      .subscribe({
        next: (postsOnSiteOns) => {
          postsOnSiteOns.forEach((postsOnS, idxOnS, arrOnS) => {
            postsOnS.createdAt.toString()?.slice(0,10).split('-').forEach((createdAtItem, indexOnS, arrayOnS) => {
              if(indexOnS === 2) {
                postsOnS.createdAt = `${arrayOnS[1]}-${arrayOnS[2]}-${arrayOnS[0]}`;
              }
            });
            this.postsOnSi.push(postsOnS);
          })
        },
        error: (error) => this.handlePostOnSErrors(error.error),
      });
  }

  public onSelectPostPCOnS(postOnSOnSite: PostApp): void {
    console.log('Selecting a Post', postOnSOnSite);
    this.selectedPostOnS = this.selectedPostOnS === postOnSOnSite ? null : postOnSOnSite;
    this.postsOnSiSubscription.unsubscribe();
  }

  public onEventPCOnS(event: Event): void {
    console.log('Preventing Event default Propagation');
    event.stopPropagation();
  }

  public onDeletePCOnS(postOnSOnSite: PostApp): void {
    this.postsOnSiDSubscription = this.postService.removePost(postOnSOnSite._id)
      .subscribe({
        next: (dPost) => {
          console.log('Deleted Post ', dPost);
          this.postsOnSi = this.postsOnSi.filter(
            dPost => dPost._id !== postOnSOnSite._id,
          );
        },
        error: (error) => this.handlePostOnSErrors(error.error),
      });
  }

  private handlePostOnSErrors(errors: string[] | string): void {
    this.postsOnSListErrors = Array.isArray(errors) ? errors : [errors];
  }

  ngOnDestroy(): void {
    this.postsOnSiSubscription.unsubscribe();
    this.postsOnSiDSubscription.unsubscribe();
  }
}
