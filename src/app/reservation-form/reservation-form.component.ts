import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReservationService } from '../reservation/reservation.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-reservation-form',
  templateUrl: './reservation-form.component.html',
  styleUrls: ['./reservation-form.component.css']
})

export class ReservationFormComponent implements OnInit {
  
  reservationForm: FormGroup = new FormGroup({})

  constructor(
    private formBuilder: FormBuilder,
    private reservationService: ReservationService,
    private router: Router,
    private activatedRoute: ActivatedRoute ){

  }

  ngOnInit(): void {
    this.reservationForm = this.formBuilder.group({
      checkInDate: ['', Validators.required],
      checkOutDate: ['', Validators.required],
      guestName: ['', Validators.required],
      guestEmail: ['', [Validators.required, Validators.email]],
      roomNumber: ['', Validators.required]
    })

    //fetching id if updating the value
    let id = this.activatedRoute.snapshot.paramMap.get('id')
    if(id){
      let reservation = this.reservationService.getReservation(id).subscribe( reservation => {
        if(reservation){
          this.reservationForm.patchValue(reservation)
        }
      });
    }
  }

  onSubmit(){
    if(this.reservationForm.valid){
      let reservation = this.reservationForm.value

      let id = this.activatedRoute.snapshot.paramMap.get('id')
      if(id){
        //Update
        this.reservationService.updateReservation(reservation, id).subscribe(()=>{
          console.log("Update request processed")
        });
      }
      else{
        //New
        this.reservationService.addReservation(reservation).subscribe(()=>{
          console.log("Create request processed")
        })
      }

      this.router.navigate(['/list'])
    }
  }
}
