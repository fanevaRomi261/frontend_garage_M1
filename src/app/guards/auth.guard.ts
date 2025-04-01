import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // console.log("is token valid : "+authService.isTokenValid());
  if (!authService.isLoggedIn() || !authService.isTokenValid()) {
    alert('Veuillez vous reconnecter, session expirée');
    router.navigate(['/login']);
    return false;
  }

  if (authService.mustChangePwd()) {
    router.navigate(['/change-password']);
    return false;
  }

  const allowedProfiles = route.data['profiles'] as string[] | undefined;
  const userProfile = authService.getUserProfile();

  console.log(allowedProfiles,userProfile);

  if (allowedProfiles && !allowedProfiles.some(profile => profile.toLowerCase() === (userProfile as string).toLowerCase())) {
    router.navigate(['/forbidden']);
    return false;
  }

  return true;
};