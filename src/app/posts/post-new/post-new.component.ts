import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PostService } from '../../services/post.service';
import { PostApp } from '../../models';

@Component({
  selector: 'app-post-new',
  templateUrl: './post-new.component.html',
  styleUrls: ['./post-new.component.css']
})
export class PostNewComponent implements OnInit, OnDestroy {
  public postAppOldSubscription: Subscription = new Subscription();
  public postAppOld: PostApp = new PostApp();
  public oldPostPickedImage: any = '';
  public oldPostAppOldD: boolean = true;

  public postAppNewSubscription: Subscription = new Subscription();
  public postAppNew: PostApp = new PostApp();
  public newSelectedPostFile!: File;
  public newPostPickedImage: any = '';

  public postsAppNewSubscription: Subscription = new Subscription();
  public postsAppNew: Array<PostApp> = [];

  public postNewErrors: string[] = [];

  public newSelectedPostFiles!: FileList;
  public newSelectedPostFilesL: File[] = [];
  public newPostPickedImages: any[] = [];

  public newSelectedPostFilesV!: FileList;
  public newSelectedPostFilesVL: File[] = [];
  public newPostPickedVideos: any[] = [];

  public postAppNewForm!: FormGroup;
  constructor(
    private readonly route: ActivatedRoute,
    private readonly postService: PostService,
    private readonly router: Router,
    private readonly formBuilder: FormBuilder
  ) { }


  ngOnInit(): void {
    this.postAppNewForm = this.formBuilder.group({
      content: [null, Validators.minLength(1)],
      category: [null, [Validators.minLength(1), Validators.maxLength(360)]],
      mainImage: null,
      mainImageO: null,
      mainImageSwitch: [this.oldPostAppOldD, Validators.required],
      images: null,
      videos: null
    });
    this.postsAppNewSubscription = this.postService.getSitePosts().subscribe({
      next: (postsAppNew) => {
        this.postsAppNew = postsAppNew;
        this.mainImageO?.setValue(this.postsAppNew[0].mainImage._id, {
          onlySelf: true,
        })
        this.oldPostPickedImage = this.postsAppNew[0].mainImagePath;
      },
      error: (error) => this.handlePostNewErrors(error.error.message)
    })
  }

  get mainImage() {
    return this.postAppNewForm.get('mainImage');
  }

  get content() {
    return this.postAppNewForm.get('content');
  }

  get category() {
    return this.postAppNewForm.get('category');
  }

  get images() {
    return this.postAppNewForm.get('images');
  }

  get videos() {
    return this.postAppNewForm.get('videos');
  }

  get mainImageSwitch() {
    return this.postAppNewForm.get('mainImageSwitch');
  }

  onNewPPickedImageSwitch(event: Event): void {
    this.oldPostAppOldD = (this.oldPostAppOldD === true) ? false : true;
    if (this.oldPostAppOldD === true) {
      this.postAppOld = this.postsAppNew[0];
      this.oldPostPickedImage = this.postAppOld.mainImagePath;
      this.mainImageO?.setValue(this.postAppOld.mainImage._id, {
        onlySelf: true,
      })
    } else {
      this.postAppOld  = new PostApp();
      this.oldPostPickedImage = '';
      this.mainImageO?.setValue(null, {
        onlySelf: true,
      })
    }
    this.content?.setValue(null, {
      onlySelf: true,
    })
    this.category?.setValue(null, {
      onlySelf: true,
    })
    this.images?.setValue(null, {
      onlySelf: true,
    })
    this.videos?.setValue(null, {
      onlySelf: true,
    })
    this.mainImage?.setValue(null, {
      onlySelf: true,
    })
    this.postAppNewForm.updateValueAndValidity();
    this.newPostPickedImages = [];
    this.newPostPickedVideos = [];
    this.newPostPickedImage = '';
  }

  onNewPPickedImage(event: Event): void {
    const reader: FileReader = new FileReader();
    const file: File = (event.target as HTMLInputElement)!.files![0];
    this.newSelectedPostFile = file;
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.newPostPickedImage = reader.result as string;
    };
  }

  get mainImageO() {
    return this.postAppNewForm.get('mainImageO');
  }

  onNewPOPickedImage(event: any): void {
    if(event.target.value !== null) {
      this.postAppOldSubscription = this.postService.getPost(event.target.value.split(event.target.value[2],event.target.value.length)[1])
        .subscribe({
          next: (postAppOld) => {
            this.postAppOld = postAppOld;
            this.mainImageO?.setValue(this.postAppOld.mainImage._id, {
              onlySelf: true,
            })
            this.oldPostPickedImage = this.postAppOld.mainImagePath;
          },
          error: (error) => this.handlePostNewErrors(error.error.message)
        })
    } else {
      if (this.postAppOld) {
        this.postAppOld = new PostApp();
      }
      if (this.oldPostPickedImage !== '') {
        this.oldPostPickedImage = '';
      }
      if (!this.postAppOldSubscription.closed) {
        this.postAppOldSubscription.unsubscribe();
      }
    }
  }

  onNewPPickedImages(event: Event): void {
    this.newPostPickedImages = [];
    this.newSelectedPostFilesL = [];
    this.newSelectedPostFiles = (event.target as HTMLInputElement)!.files!;
    console.log(this.newSelectedPostFiles, event.target);
    for(let i: number = 0; i<this.newSelectedPostFiles.length; i++) {
      let file: File = (event.target as HTMLInputElement)!.files![i];
      this.newSelectedPostFilesL.push(file);
      const reader: FileReader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.newPostPickedImages.push(reader.result as string);
      };
    }
  }

  onNewPPickedVideos(event: Event): void {
    this.newPostPickedVideos = [];
    this.newSelectedPostFilesVL = [];
    this.newSelectedPostFilesV = (event.target as HTMLInputElement)!.files!;
    for(let i: number = 0; i<this.newSelectedPostFilesV.length; i++) {
      let file: File = (event.target as HTMLInputElement)!.files![i];
      this.newSelectedPostFilesVL.push(file);
      const reader: FileReader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.newPostPickedVideos.push(reader.result as string);
      };
    }
  }

  onNewPostSubmit(): void {
    let thisN: Array<File|File[]> = [this.newSelectedPostFile, this.newSelectedPostFilesL, this.newSelectedPostFilesVL];
    this.postAppNew = this.postAppNewForm.value;
    console.log(this.postAppNewForm, this.postAppNewForm.value, thisN)
    this.postAppNewSubscription = this.postService.createPost(this.postAppNew, thisN).subscribe({
      next: (newPostApp) => {
        this.postsAppNewSubscription = this.postService.getSitePosts().subscribe({
          next: (postsAppNew) => {
            this.postsAppNew = postsAppNew;
            console.log('Submitted a New Review.', newPostApp, this.postAppNew, this.postsAppNew, 'dfsdfsdfsdf', postsAppNew);
            this.postAppNewForm.reset();
            this.router.navigateByUrl('/admin/dash');
          },
          error: (error) => this.handlePostNewErrors(error.error.message)
        })
      },
      error: (error) => {
        this.handlePostNewErrors(error.error);
      }
    });
  }

  private handlePostNewErrors(errors: string[] | string) {
    this.postNewErrors = Array.isArray(errors) ? errors : [errors];
  }

  ngOnDestroy(): void {
    this.postAppNewSubscription.unsubscribe();
    this.postAppOldSubscription.unsubscribe();
    this.postsAppNewSubscription.unsubscribe();
  }

}
