import { Component, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import { Editor, Toolbar } from 'ngx-editor';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DashboardService } from '../common_service/dashboard.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-forum-details',
  templateUrl: './forum-details.component.html',
  styleUrls: ['./forum-details.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ForumDetailsComponent implements OnInit, OnDestroy {

  id: any; 
  Forum: any; 
  editor!: Editor; 

  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link', 'image'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];

  form = new FormGroup({
    editorContent: new FormControl('', { validators: Validators.required }),
  });

  ForumAnswer = {
    content: '',
    forumid: ''
  };

  constructor(
    private serive: DashboardService,
    private router: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) {
    this.id = this.router.snapshot.paramMap.get('id'); 
  }

  ngOnInit(): void {
    this.editor = new Editor();
    this.ForumAnswer.forumid = this.id; 
    this.loadForumDetails(); 
  }

  loadForumDetails(): void {
    this.serive.GetForumGetByID(this.id).subscribe(result => {
      if (result?.data) {
        if (Array.isArray(result.data)) {
          this.Forum = result.data.map((forum: any) => ({
            ...forum,
            sanitizedDescription: this.sanitizer.bypassSecurityTrustHtml(forum.description),
            answer: forum.answer.map((ans: any) => ({
              ...ans,
              sanitizedDescription: this.sanitizer.bypassSecurityTrustHtml(ans.content)
            }))
          }));
        } else {
          this.Forum = {
            ...result.data,
            sanitizedDescription: this.sanitizer.bypassSecurityTrustHtml(result.data.description),
            answer: result.data.answer.map((ans: any) => ({
              ...ans,
              sanitizedDescription: this.sanitizer.bypassSecurityTrustHtml(ans.content)
            }))
          };
        }
      } else {
        console.error("No data received from the API");
      }
    }, error => {
      console.error("Error fetching forum data:", error);
    });
  }

  PostAnswer(): void {

    this.serive.AddForumAnswer(this.ForumAnswer).subscribe({
      next: (response) => {
        Swal.fire('Success!', 'Your answer has been posted successfully!', 'success');
        this.form.reset(); 
        this.loadForumDetails(); 
      },
      error: (error) => {
        Swal.fire('Error', 'There was an issue posting your answer. Please try again.', 'error');
      }
    });
  }

  ngOnDestroy(): void {
    this.editor.destroy(); 
  }
}
