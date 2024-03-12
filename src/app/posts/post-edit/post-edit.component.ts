import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { PostService } from '../../services/post.service';
import { PostApp } from '../../models';

@Component({
  selector: 'app-post-edit',
  templateUrl: './post-edit.component.html',
  styleUrls: ['./post-edit.component.css']
})
export class PostEditComponent implements OnInit, OnDestroy {
  public postAppEditSubscription: Subscription = new Subscription();
  public postsAppEditSubscription: Subscription = new Subscription();
  public postAppEditForm!: FormGroup;
  public postAppEdit: PostApp = new PostApp();
  public postsAppEdit: Array<PostApp> = [];
  public postEditErrors: string[] = [];

  public editSelectedPostFile!: File;
  public editPostPickedImage: any = '';
  public editSelectedPostFiles!: FileList;
  public editSelectedPostFilesL: File[] = [];
  public editPostPickedImages: any[] = [];
  public editSelectedPostFilesV!: FileList;
  public editSelectedPostFilesVL: File[] = [];
  public editPostPickedVideos: any[] = [];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly postService: PostService,
    private readonly router: Router,
    private readonly formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.postAppEditSubscription = this.route.paramMap
      .pipe(
        map(params => params.get('id')),
        switchMap(id => this.postService.getPost(id as string)),
      )
      .subscribe({
        next: (postAppEdit) => {
          this.postAppEdit = postAppEdit;
        },
        error: (error) => this.handlePostEditErrors(error.error.message)
      });
    this.postAppEditForm = this.formBuilder.group({
      content: [null, Validators.minLength(1)],
      category: [null, [Validators.minLength(1), Validators.maxLength(360)]],
      writtenBy: [null, [Validators.minLength(1), Validators.maxLength(360)]],
      likes: null,
      mainImage: null,
      images: null,
      videos: null
    });
  }

  onEditPPickedImage(event: Event): void {
    const reader: FileReader = new FileReader();
    const file: File = (event.target as HTMLInputElement)!.files![0];
    this.editSelectedPostFile = file;
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.editPostPickedImage = reader.result as string;
    };
  }

  onEditPPickedImages(event: Event): void {
    this.editPostPickedImages = [];
    this.editSelectedPostFilesL = [];
    this.editSelectedPostFiles = (event.target as HTMLInputElement)!.files!;
    console.log(this.editSelectedPostFiles, event.target);
    for(let i: number = 0; i<this.editSelectedPostFiles.length; i++) {
      let file: File = (event.target as HTMLInputElement)!.files![i];
      this.editSelectedPostFilesL.push(file);
      const reader: FileReader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.editPostPickedImages.push(reader.result as string);
      };
    }
  }

  onEditPPickedVideos(event: Event): void {
    this.editPostPickedVideos = [];
    this.editSelectedPostFilesVL = [];
    this.editSelectedPostFilesV = (event.target as HTMLInputElement)!.files!;
    for(let i: number = 0; i<this.editSelectedPostFilesV.length; i++) {
      let file: File = (event.target as HTMLInputElement)!.files![i];
      this.editSelectedPostFilesVL.push(file);
      const reader: FileReader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.editPostPickedVideos.push(reader.result as string);
      };
    }
  }

  onEditPostSubmit(): void {
    let thisV: Array<File|File[]> = [this.editSelectedPostFile, this.editSelectedPostFilesL, this.editSelectedPostFilesVL];
    console.log(this.postAppEdit, thisV);
    this.postAppEditForm.value.content = this.postAppEditForm.value.content === null ? this.postAppEdit.content : this.postAppEditForm.value.content;
    this.postAppEditForm.value.category = this.postAppEditForm.value.category === null ? this.postAppEdit.category : this.postAppEditForm.value.category;
    this.postAppEditForm.value.writtenBy = this.postAppEditForm.value.writtenBy === null ? this.postAppEdit.writtenBy : this.postAppEditForm.value.writtenBy;
    this.postAppEditForm.value.likes = this.postAppEditForm.value.likes === null ? this.postAppEdit.likes : this.postAppEditForm.value.likes;
    this.postAppEditForm.value.newObject = JSON.stringify(this.postAppEdit);
    this.postAppEditSubscription = this.postService.updatePost({...this.postAppEditForm.value, _id: this.postAppEdit._id}, thisV)
      .subscribe({
        next: (updatedPostAppEdit) => {
          this.postsAppEditSubscription = this.postService.getSitePosts().subscribe({
            next: (postsAppEdit) => {
              this.postsAppEdit = postsAppEdit;
              this.router.navigateByUrl('admin/dash');
            },
            error: (error) => this.handlePostEditErrors(error.error.message)
          })
        },
        error: (error) => this.handlePostEditErrors(error.error),
      })
  }

  private handlePostEditErrors(errors: string[] | string) {
    this.postEditErrors = Array.isArray(errors) ? errors : [errors];
  }

  ngOnDestroy(): void {
    this.postAppEditSubscription.unsubscribe();
    this.postsAppEditSubscription.unsubscribe();
  }

}
