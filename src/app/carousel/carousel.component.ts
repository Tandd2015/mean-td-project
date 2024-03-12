import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { Post, Review, ReviewApp, PostApp } from '../models';
import { BreakpointObserver } from '@angular/cdk/layout';
import { distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css']
})
export class CarouselComponent implements OnInit {
  // Google Reviews Variables for the carousel component.
  @Input() carouselGoogleReviews: Review[] = [];
  public carouselGoogleReviewsToDisplay: Review[] = [];
  @Input() carouselGoogleReviewsRating: number[] = [];
  public carouselGoogleReviewsRatingToDisplay: number[] = [];
  public paginatorObjectGoogleReviews: any = {};
  public selectedIndexGoogleReviews: number = 0;
  public carouselGoogleReviewsAutoSlideInterval!: any;
  @Input() carouselGoogleReviewsIndicators: boolean = true;
  @Input() carouselGoogleReviewsControls: boolean = true;
  @Input() carouselGoogleReviewsAutoSlide: boolean = false;
  @Input() carouselGoogleReviewsSlideInterval: number = 3500;

  // Onsite Reviews Variables for the carousel component.
  @Input() carouselOnsiteReviews: ReviewApp[] = [];
  public carouselOnsiteReviewsToDisplay: ReviewApp[] = [];
  @Input() carouselOnsiteReviewsRating: number[] = [];
  public carouselOnsiteReviewsRatingToDisplay: number[] = [];
  public paginatorObjectOnsiteReviews: any = {};
  public selectedIndexOnsiteReviews: number = 0;
  public carouselOnsiteReviewsAutoSlideInterval!: any;
  @Input() carouselOnsiteReviewsIndicators: boolean = true;
  @Input() carouselOnsiteReviewsControls: boolean = true;
  @Input() carouselOnsiteReviewsAutoSlide: boolean = false;
  @Input() carouselOnsiteReviewsSlideInterval: number = 3500;

  // Reviews Variables for the carousel component.
  public readonly: boolean = true;
  public max: number = 5;

  // Google Posts Variables for the carousel component.
  @Input() carouselGooglePosts: Post[] = [];
  public carouselGooglePostsToDisplay: Post[] = [];
  @Input() posterLinkGooglePosts: string = '';
  public paginatorObjectGooglePosts: any = {};
  public selectedIndexGooglePosts: number = 0;
  public carouselGooglePostsAutoSlideInterval!: any;
  @Input() carouselGooglePostsIndicators: boolean = true;
  @Input() carouselGooglePostsControls: boolean = true;
  @Input() carouselGooglePostsAutoSlide: boolean = false;
  @Input() carouselGooglePostsSlideInterval: number = 3500;

  // Onsite Posts Variables for the carousel component.
  @Input() carouselOnsitePosts: PostApp[] = [];
  public carouselOnsitePostsToDisplay: PostApp[] = [];
  @Input() posterLinkOnsitePosts: string = '';
  public paginatorObjectOnsitePosts: any = {};
  public selectedIndexOnsitePosts: number = 0;
  public carouselOnsitePostsAutoSlideInterval!: any;
  @Input() carouselOnsitePostsIndicators: boolean = true;
  @Input() carouselOnsitePostsControls: boolean = true;
  @Input() carouselOnsitePostsAutoSlide: boolean = false;
  @Input() carouselOnsitePostsSlideInterval: number = 3500;

  // Universal Variables for the carousel component.
  public carouselErrors: string[] = [];

  public isCarouselReviewReadMore: boolean = false;
  public isCarouselPostReadMore: boolean = false;
  public isCarouselShowReadMore: boolean = false;
  public readonly breakPointAbout: any = this.breakPointObserverAbout.observe(['(max-width: 2440px)']).pipe(distinctUntilChanged());

  constructor(private readonly breakPointObserverAbout: BreakpointObserver) { }

  ngOnInit(): void {};

  public aboutToggleIsCarouselReviewReadMore(): void {
    this.isCarouselReviewReadMore = this.isCarouselReviewReadMore === true ? !this.isCarouselReviewReadMore : true;
    console.log('this.isCarouselReviewReadMore =>', this.isCarouselReviewReadMore);
  }

  public aboutToggleIsCarouselPostReadMore(): void {
    this.isCarouselPostReadMore = this.isCarouselPostReadMore === true ? !this.isCarouselPostReadMore : true;
    console.log('this.isCarouselPostReadMore =>', this.isCarouselPostReadMore);
  }

  public aboutToggleIsCarouselShowReadMore(): void {
    if(this.breakPointObserverAbout.isMatched('(min-width: 2440px)')) {
      console.log('this.isCarouselShowReadMore =>', this.isCarouselShowReadMore);
      this.isCarouselShowReadMore = true;
      this.isCarouselReviewReadMore = true;
      this.isCarouselPostReadMore = true;
    }
    if(this.breakPointObserverAbout.isMatched('(max-width: 2440px)')) {
      console.log('this.isCarouselShowReadMore =>', this.isCarouselShowReadMore);
      this.isCarouselShowReadMore = false;
      this.isCarouselReviewReadMore = false;
      this.isCarouselPostReadMore = false;
    }
  }

  ngDoCheck(): void {};

  ngOnChanges(changes: SimpleChanges): void {
    for(let i in changes) {
      if(changes[i] === changes['carouselGoogleReviewsAutoSlide']) {
        this.carouselGoogleReviewsAutoSlide = changes[i].currentValue;
      };
      if(changes[i] === changes['carouselOnsiteReviewsAutoSlide']) {
        this.carouselOnsiteReviewsAutoSlide = changes[i].currentValue;
      };
      if(changes[i] === changes['carouselGooglePostsAutoSlide']) {
        this.carouselGooglePostsAutoSlide = changes[i].currentValue;
      };
      if(changes[i] === changes['carouselOnsitePostsAutoSlide']) {
        this.carouselOnsitePostsAutoSlide = changes[i].currentValue;
      };
      if(changes[i] === changes['carouselGoogleReviews']) {
        this.carouselGoogleReviews = changes[i].currentValue;
      };
      if(changes[i] === changes['carouselGooglePosts']) {
        this.carouselGooglePosts = changes[i].currentValue;
      };
    };
    if(this.carouselGoogleReviewsAutoSlide === true) {
      this.autoSlideGoogleReviews();
    } else {
      clearInterval(this.carouselGoogleReviewsAutoSlideInterval);
    };
    if(this.carouselOnsiteReviewsAutoSlide === true) {
      this.autoSlideOnsiteReviews();
    } else {
      clearInterval(this.carouselOnsiteReviewsAutoSlideInterval);
    };
    if(this.carouselGooglePostsAutoSlide === true) {
      this.autoSlideGooglePosts();
    } else {
      clearInterval(this.carouselGooglePostsAutoSlideInterval);
    };
    if(this.carouselOnsitePostsAutoSlide === true) {
      this.autoSlideOnsitePosts();
    } else {
      clearInterval(this.carouselOnsitePostsAutoSlideInterval);
    };
  };


  // Google Reviews Functions for the carousel component.
  public aTagPreventDGoogleReview(e: Event): void {
    e.preventDefault();
  }

  public autoSlideGoogleReviews(): void {
    this.carouselGoogleReviewsAutoSlideInterval = setInterval(() => {
      this.onNextClickGoogleReviews();
    }, this.carouselGoogleReviewsSlideInterval);
  };

  public selectCarouselSlideGoogleReviews(index: number): void {
    this.selectedIndexGoogleReviews = index;
    this.paginatorObjectToGoogleReviewsArray();
  }

  public onPrevClickGoogleReviews(): void {
    if (this.selectedIndexGoogleReviews === 0) {
      this.selectedIndexGoogleReviews = this.carouselGoogleReviews.length - 1;
    } else {
      this.selectedIndexGoogleReviews--;
    }
    this.paginatorObjectToGoogleReviewsArray();
  };

  public onNextClickGoogleReviews(): void {
    if (this.selectedIndexGoogleReviews === this.carouselGoogleReviews.length - 1) {
      this.selectedIndexGoogleReviews = 0;
    } else {
      this.selectedIndexGoogleReviews++;
    }
    this.paginatorObjectToGoogleReviewsArray();
  };

  public paginatorGoogleReviews(tItems: number, currentPage: number, perPage: number = 1) {
    let totalPages: number = Math.ceil(tItems / perPage);
    let startPage: number, endPage: number;
    if (currentPage < 1) {
      currentPage = 0;
      startPage = currentPage;
      endPage = currentPage + 2;
    } else if (currentPage > totalPages) {
      currentPage = totalPages;
    };

    if(totalPages < 3) {
      startPage = 0;
      endPage = totalPages;
    } else {
      if(currentPage >= 2 && currentPage + 1 <= totalPages) {
        startPage = currentPage - 1;
        endPage = currentPage + 1;
      } else if(currentPage === 1) {
        startPage = currentPage - 1;
        endPage = currentPage + 1;
      } else if(currentPage >= 2 && currentPage + 1 > totalPages) {
        startPage = currentPage - 2;
        endPage = currentPage;
      } else if(currentPage >= 2 && currentPage === tItems - 1) {
        startPage = currentPage - 2;
        endPage = currentPage;
      };
    };

    let startIndex: number = (currentPage - 1) * perPage;
    let endIndex: number = Math.min(startIndex + perPage - 1, tItems - 1);
    let displayedPages: number[] = Array.from(Array((endPage! + 1) - startPage!).keys()).map(i => startPage! + i);
    if(currentPage === 0) {
      displayedPages[displayedPages.length - 1] = displayedPages[1];
      displayedPages[1] = displayedPages[0];
      displayedPages[0] = tItems-1;
    } else if(currentPage === tItems-1) {
      displayedPages[displayedPages.length-1] = 0;
    };

    return {
      totalItems: tItems,
      currentPage: currentPage,
      pageSize: perPage,
      totalPages: totalPages,
      startPage: startPage!,
      endPage: endPage!,
      startIndex: startIndex,
      endIndex: endIndex,
      displayedPages: displayedPages
    };
  };

  public paginatorObjectToGoogleReviewsArray(): void {
    this.paginatorObjectGoogleReviews = this.paginatorGoogleReviews(this.carouselGoogleReviews.length, this.selectedIndexGoogleReviews);
    if (this.selectedIndexGoogleReviews === 0 || this.selectedIndexGoogleReviews === this.carouselGoogleReviews.length-1) {
      this.paginatorObjectGoogleReviews.displayedPages.forEach((v: number, i: number) => {
        this.carouselGoogleReviewsToDisplay[i] = this.carouselGoogleReviews[v];
        this.carouselGoogleReviewsRatingToDisplay[i] = this.carouselGoogleReviewsRating[v];
      })
    } else if (this.selectedIndexGoogleReviews < this.carouselGoogleReviews.length-1) {
      this.carouselGoogleReviewsToDisplay = this.carouselGoogleReviews.slice(this.paginatorObjectGoogleReviews.displayedPages[0], this.paginatorObjectGoogleReviews.displayedPages[this.paginatorObjectGoogleReviews.displayedPages.length-1]+1);
      this.carouselGoogleReviewsRatingToDisplay = this.carouselGoogleReviewsRating.slice(this.paginatorObjectGoogleReviews.displayedPages[0], this.paginatorObjectGoogleReviews.displayedPages[this.paginatorObjectGoogleReviews.displayedPages.length-1]+1);
    }
  };

  // Onsite Reviews Functions for the carousel component.
  public autoSlideOnsiteReviews(): void {
    this.carouselOnsiteReviewsAutoSlideInterval = setInterval(() => {
      this.onNextClickOnsiteReviews();
    }, this.carouselOnsiteReviewsSlideInterval);
  };

  public selectCarouselSlideOnsiteReviews(index: number): void {
    this.selectedIndexOnsiteReviews = index;
    this.paginatorObjectToOnsiteReviewsArray();
  }

  public onPrevClickOnsiteReviews(): void {
    if (this.selectedIndexOnsiteReviews === 0) {
      this.selectedIndexOnsiteReviews = this.carouselOnsiteReviews.length - 1;
    } else {
      this.selectedIndexOnsiteReviews--;
    }
    this.paginatorObjectToOnsiteReviewsArray();
  };

  public onNextClickOnsiteReviews(): void {
    if (this.selectedIndexOnsiteReviews === this.carouselOnsiteReviews.length - 1) {
      this.selectedIndexOnsiteReviews = 0;
    } else {
      this.selectedIndexOnsiteReviews++;
    }
    this.paginatorObjectToOnsiteReviewsArray();
  };

  public paginatorOnsiteReviews(tItems: number, currentPage: number, perPage: number = 1) {
    let totalPages: number = Math.ceil(tItems / perPage);
    let startPage: number, endPage: number;
    if (currentPage < 1) {
      currentPage = 0;
      startPage = currentPage;
      endPage = currentPage + 2;
    } else if (currentPage > totalPages) {
      currentPage = totalPages;
    };

    if(totalPages < 3) {
      startPage = 0;
      endPage = totalPages;
    } else {
      if(currentPage >= 2 && currentPage + 1 <= totalPages) {
        startPage = currentPage - 1;
        endPage = currentPage + 1;
      } else if(currentPage === 1) {
        startPage = currentPage - 1;
        endPage = currentPage + 1;
      } else if(currentPage >= 2 && currentPage + 1 > totalPages) {
        startPage = currentPage - 2;
        endPage = currentPage;
      } else if(currentPage >= 2 && currentPage === tItems - 1) {
        startPage = currentPage - 2;
        endPage = currentPage;
      };
    };

    let startIndex: number = (currentPage - 1) * perPage;
    let endIndex: number = Math.min(startIndex + perPage - 1, tItems - 1);
    let displayedPages: number[] = Array.from(Array((endPage! + 1) - startPage!).keys()).map(i => startPage! + i);
    if(currentPage === 0) {
      displayedPages[displayedPages.length - 1] = displayedPages[1];
      displayedPages[1] = displayedPages[0];
      displayedPages[0] = tItems-1;
    } else if(currentPage === tItems-1) {
      displayedPages[displayedPages.length-1] = 0;
    };

    return {
      totalItems: tItems,
      currentPage: currentPage,
      pageSize: perPage,
      totalPages: totalPages,
      startPage: startPage!,
      endPage: endPage!,
      startIndex: startIndex,
      endIndex: endIndex,
      displayedPages: displayedPages
    };
  };

  public paginatorObjectToOnsiteReviewsArray(): void {
    this.paginatorObjectOnsiteReviews = this.paginatorOnsiteReviews(this.carouselOnsiteReviews.length, this.selectedIndexOnsiteReviews);
    if (this.selectedIndexOnsiteReviews === 0 || this.selectedIndexOnsiteReviews === this.carouselOnsiteReviews.length-1) {
      this.paginatorObjectOnsiteReviews.displayedPages.forEach((v: number, i: number) => {
        this.carouselOnsiteReviewsToDisplay[i] = this.carouselOnsiteReviews[v];
        this.carouselOnsiteReviewsRatingToDisplay[i] = this.carouselOnsiteReviewsRating[v];
      })
    } else if (this.selectedIndexOnsiteReviews < this.carouselOnsiteReviews.length-1) {
      this.carouselOnsiteReviewsToDisplay = this.carouselOnsiteReviews.slice(this.paginatorObjectOnsiteReviews.displayedPages[0], this.paginatorObjectOnsiteReviews.displayedPages[this.paginatorObjectOnsiteReviews.displayedPages.length-1]+1);
      this.carouselOnsiteReviewsRatingToDisplay = this.carouselOnsiteReviewsRating.slice(this.paginatorObjectOnsiteReviews.displayedPages[0], this.paginatorObjectOnsiteReviews.displayedPages[this.paginatorObjectOnsiteReviews.displayedPages.length-1]+1);
    }
  };


  // Google Posts Functions for the carousel component.
  public aTagPreventDGooglePost(e: Event): void {
    e.preventDefault();
  }

  public autoSlideGooglePosts(): void {
    this.carouselGooglePostsAutoSlideInterval = setInterval(() => {
      this.onNextClickGooglePosts();
    }, this.carouselGooglePostsSlideInterval);
  };

  public selectCarouselSlideGooglePosts(index: number): void {
    this.selectedIndexGooglePosts = index;
    this.paginatorObjectToGooglePostsArray();
  }

  public onPrevClickGooglePosts(): void {
    if (this.selectedIndexGooglePosts === 0) {
      this.selectedIndexGooglePosts = this.carouselGooglePosts.length - 1;
    } else {
      this.selectedIndexGooglePosts--;
    }
    this.paginatorObjectToGooglePostsArray();
  };

  public onNextClickGooglePosts(): void {
    if (this.selectedIndexGooglePosts === this.carouselGooglePosts.length - 1) {
      this.selectedIndexGooglePosts = 0;
    } else {
      this.selectedIndexGooglePosts++;
    }
    this.paginatorObjectToGooglePostsArray();
  };

  public paginatorGooglePosts(tItems: number, currentPage: number, perPage: number = 1) {
    let totalPages: number = Math.ceil(tItems / perPage);
    let startPage: number, endPage: number;
    if (currentPage < 1) {
      currentPage = 0;
      startPage = currentPage;
      endPage = currentPage + 2;
    } else if (currentPage > totalPages) {
      currentPage = totalPages;
    };

    if(totalPages < 3) {
      startPage = 0;
      endPage = totalPages;
    } else {
      if(currentPage >= 2 && currentPage + 1 <= totalPages) {
        startPage = currentPage - 1;
        endPage = currentPage + 1;
      } else if(currentPage === 1) {
        startPage = currentPage - 1;
        endPage = currentPage + 1;
      } else if(currentPage >= 2 && currentPage + 1 > totalPages) {
        startPage = currentPage - 2;
        endPage = currentPage;
      } else if(currentPage >= 2 && currentPage === tItems - 1) {
        startPage = currentPage - 2;
        endPage = currentPage;
      };
    };

    let startIndex: number = (currentPage - 1) * perPage;
    let endIndex: number = Math.min(startIndex + perPage - 1, tItems - 1);
    let displayedPages: number[] = Array.from(Array((endPage! + 1) - startPage!).keys()).map(i => startPage! + i);
    if(currentPage === 0) {
      displayedPages[displayedPages.length - 1] = displayedPages[1];
      displayedPages[1] = displayedPages[0];
      displayedPages[0] = tItems-1;
    } else if(currentPage === tItems-1) {
      displayedPages[displayedPages.length-1] = 0;
    };

    return {
      totalItems: tItems,
      currentPage: currentPage,
      pageSize: perPage,
      totalPages: totalPages,
      startPage: startPage!,
      endPage: endPage!,
      startIndex: startIndex,
      endIndex: endIndex,
      displayedPages: displayedPages
    };
  };

  public paginatorObjectToGooglePostsArray(): void {
    this.paginatorObjectGooglePosts = this.paginatorGooglePosts(this.carouselGooglePosts.length, this.selectedIndexGooglePosts);
    if (this.selectedIndexGooglePosts === 0 || this.selectedIndexGooglePosts === this.carouselGooglePosts.length-1) {
      this.paginatorObjectGooglePosts.displayedPages.forEach((v: number, i: number) => {
        this.carouselGooglePostsToDisplay[i] = this.carouselGooglePosts[v];
      })
    } else if (this.selectedIndexGooglePosts < this.carouselGooglePosts.length-1) {
      this.carouselGooglePostsToDisplay = this.carouselGooglePosts.slice(this.paginatorObjectGooglePosts.displayedPages[0], this.paginatorObjectGooglePosts.displayedPages[this.paginatorObjectGooglePosts.displayedPages.length-1]+1);
    }
  };


  // Onsite Posts Functions for the carousel component.
  public autoSlideOnsitePosts(): void {
    this.carouselOnsitePostsAutoSlideInterval = setInterval(() => {
      this.onNextClickOnsitePosts();
    }, this.carouselOnsitePostsSlideInterval);
  };

  public selectCarouselSlideOnsitePosts(index: number): void {
    this.selectedIndexOnsitePosts = index;
    this.paginatorObjectToOnsitePostsArray();
  }

  public onPrevClickOnsitePosts(): void {
    if (this.selectedIndexOnsitePosts === 0) {
      this.selectedIndexOnsitePosts = this.carouselOnsitePosts.length - 1;
    } else {
      this.selectedIndexOnsitePosts--;
    }
    this.paginatorObjectToOnsitePostsArray();
  };

  public onNextClickOnsitePosts(): void {
    if (this.selectedIndexOnsitePosts === this.carouselOnsitePosts.length - 1) {
      this.selectedIndexOnsitePosts = 0;
    } else {
      this.selectedIndexOnsitePosts++;
    }
    this.paginatorObjectToOnsitePostsArray();
  };

  public paginatorOnsitePosts(tItems: number, currentPage: number, perPage: number = 1) {
    let totalPages: number = Math.ceil(tItems / perPage);
    let startPage: number, endPage: number;
    if (currentPage < 1) {
      currentPage = 0;
      startPage = currentPage;
      endPage = currentPage + 2;
    } else if (currentPage > totalPages) {
      currentPage = totalPages;
    };

    if(totalPages < 3) {
      startPage = 0;
      endPage = totalPages;
    } else {
      if(currentPage >= 2 && currentPage + 1 <= totalPages) {
        startPage = currentPage - 1;
        endPage = currentPage + 1;
      } else if(currentPage === 1) {
        startPage = currentPage - 1;
        endPage = currentPage + 1;
      } else if(currentPage >= 2 && currentPage + 1 > totalPages) {
        startPage = currentPage - 2;
        endPage = currentPage;
      } else if(currentPage >= 2 && currentPage === tItems - 1) {
        startPage = currentPage - 2;
        endPage = currentPage;
      };
    };

    let startIndex: number = (currentPage - 1) * perPage;
    let endIndex: number = Math.min(startIndex + perPage - 1, tItems - 1);
    let displayedPages: number[] = Array.from(Array((endPage! + 1) - startPage!).keys()).map(i => startPage! + i);
    if(currentPage === 0) {
      displayedPages[displayedPages.length - 1] = displayedPages[1];
      displayedPages[1] = displayedPages[0];
      displayedPages[0] = tItems-1;
    } else if(currentPage === tItems-1) {
      displayedPages[displayedPages.length-1] = 0;
    };

    return {
      totalItems: tItems,
      currentPage: currentPage,
      pageSize: perPage,
      totalPages: totalPages,
      startPage: startPage!,
      endPage: endPage!,
      startIndex: startIndex,
      endIndex: endIndex,
      displayedPages: displayedPages
    };
  };

  public paginatorObjectToOnsitePostsArray(): void {
    this.paginatorObjectOnsitePosts = this.paginatorOnsitePosts(this.carouselOnsitePosts.length, this.selectedIndexOnsitePosts);
    if (this.selectedIndexOnsitePosts === 0 || this.selectedIndexOnsitePosts === this.carouselOnsitePosts.length-1) {
      this.paginatorObjectOnsitePosts.displayedPages.forEach((v: number, i: number) => {
        this.carouselOnsitePostsToDisplay[i] = this.carouselOnsitePosts[v];
      })
    } else if (this.selectedIndexOnsitePosts < this.carouselOnsitePosts.length-1) {
      this.carouselOnsitePostsToDisplay = this.carouselOnsitePosts.slice(this.paginatorObjectOnsitePosts.displayedPages[0], this.paginatorObjectOnsitePosts.displayedPages[this.paginatorObjectOnsitePosts.displayedPages.length-1]+1);
    }
  };
};
