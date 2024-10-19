import { Component, OnInit } from '@angular/core';
import { TrainerService } from 'src/app/common_service/trainer.service';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit {

  ShowQuestion:any;

  constructor(private service:TrainerService){}

  ngOnInit(): void {
    this.service.gettrainerdatabyID().subscribe(data =>{
      this.ShowQuestion = data.question;
    })
  }

}
