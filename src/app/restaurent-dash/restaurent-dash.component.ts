import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder  } from '@angular/forms';
import { ApiService } from '../shared/api.service';
import {RestaurentData} from '../restaurent-dash/restaurent.model';

@Component({
  selector: 'app-Restaurent-dash',
  templateUrl: './Restaurent-dash.component.html',
  styleUrls: ['./Restaurent-dash.component.css']
})

export class RestaurentDashComponent implements OnInit {

  formValue!:UntypedFormGroup
  RestaurentModelObj : RestaurentData = new RestaurentData;
  allRestaurentData: any;
  showAdd!:boolean;
  showBtn!:boolean;
  term:any;
  options:any=["All","Veg","Non-Veg","Both"]
  selectedOption:any=this.options[0];
  AllData:any;
  role:any

  constructor(private formbuilder: UntypedFormBuilder, private api:ApiService) { }

  ngOnInit(): void {
    this.role =  localStorage.getItem("role");
    this.formValue = this.formbuilder.group({
      name: [''],
      email: [''],
      mobile: [''],
      address: [''],
      category: [''],
      services: [''],
    })
    this.selectCategory(this.selectedOption)

    this.getAllData();

  }
  clickAddResto(){
    this.formValue.reset();
    this.showAdd = true;
    this.showBtn = false;
  }
 
  addRestaurent(){
    this.RestaurentModelObj.name = this.formValue.value.name;
    this.RestaurentModelObj.email = this.formValue.value.email;
    this.RestaurentModelObj.mobile = this.formValue.value.mobile;
    this.RestaurentModelObj.address = this.formValue.value.address;
    this.RestaurentModelObj.category = this.formValue.value.category;
    this.RestaurentModelObj.services = this.formValue.value.services;
    this.api.postRestaurent(this.RestaurentModelObj).subscribe(res => {
      console.log(res);
      alert("Restaurent Added Successfully");
      this.formValue.reset();
      let ref= document.getElementById('close');
      ref?.click();
      this.getAllData();
    }, err=>{
      console.log(err);
      alert("Restaurent Added Failed!");
    })
  }

  getAllData(){
    this.api.getRestaurent().subscribe(res => {
      this.allRestaurentData= res;
    }, err=>{
      console.log(err);
    })
  }

  deleteResto(data: any){
    this.api.deleteRestaurent(data).subscribe((res: any) => {
      console.log(res);
      alert("Restaurent Deleted Successfully");
      this.getAllData();
    })
  }

  onEditResto(data: any){
    this.showAdd = false;
    this.showBtn = true;
    this.RestaurentModelObj.id = data.id;
    this.formValue.controls['name'].setValue(data.name);
    this.formValue.controls['email'].setValue(data.email);
    this.formValue.controls['mobile'].setValue(data.mobile);
    this.formValue.controls['address'].setValue(data.address);
    this.formValue.controls['category'].setValue(data.category);
    this.formValue.controls['services'].setValue(data.services);
  }
  updateResto(){
    this.RestaurentModelObj.name = this.formValue.value.name;
    this.RestaurentModelObj.email = this.formValue.value.email;
    this.RestaurentModelObj.mobile = this.formValue.value.mobile;
    this.RestaurentModelObj.address = this.formValue.value.address;
    this.RestaurentModelObj.category = this.formValue.value.category;
    this.RestaurentModelObj.services = this.formValue.value.services;
    this.api.updateRestaurent(this.RestaurentModelObj.id,this.RestaurentModelObj).subscribe((res: any) => {
      alert("Restaurent Updated Successfully");
      this.formValue.reset();
      let ref= document.getElementById('close');
      ref?.click();
      this.getAllData();
    })
    
  }

  selectCategory(e:any){
    this.selectedOption= e
    if(this.selectedOption == "All"){
      this.AllData = this.allRestaurentData
    }else{
      this.AllData =this.allRestaurentData.filter((data:any)=>{
        return data.category==this.selectedOption
      })
    }
   
  

  }
  onOrder(){
    const utterance = new SpeechSynthesisUtterance("Order Placed");

    // Select a voice
    const voices = speechSynthesis.getVoices();
    utterance.voice = voices[0]; // Choose a specific voice
  
    // Speak the text
    speechSynthesis.speak(utterance);
    alert(`Order Placed !`)
    
  }
  
}
