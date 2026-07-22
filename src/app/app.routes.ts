import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AppComponent } from './app.component';
import { RoleSelectionComponent } from './role-selection/role-selection.component';
import { EngagementFormComponent } from './engagement-form/engagement-form.component';
import { AuthformComponent } from './authform/authform.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { EngagementImpartialityComponent } from './engagement-impartiality/engagement-impartiality.component';
import { authGuard } from './auth.guard';

export const routes: Routes = [
   {path : 'Dashboard' , component: DashboardComponent ,canActivate:[authGuard]},
    {path : '' , component:RoleSelectionComponent },
    {path : 'Engagment' , component:EngagementFormComponent },
    {path:'login' ,component:AuthformComponent},
    {path:'404' , component:NotFoundComponent},
    {path:'EngagementImp' , component:EngagementImpartialityComponent}
];
