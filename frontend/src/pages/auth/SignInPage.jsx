import { SignIn, useAuth } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";
import PageWrapper from '../../components/layout/PaperWrapper';

export default function SignInPage() {
  const { isLoaded, isSignedIn } = useAuth();

  if (isLoaded && isSignedIn) {
    return <Navigate to="/front-main" replace />;
  }

  return (
    <PageWrapper>
      <div style={{ display: "flex", justifyContent: "center", marginTop: 40, minHeight: '60vh' }}>
        <SignIn
          routing="virtual"
          fallbackRedirectUrl="/#/front-main"
          forceRedirectUrl="/#/front-main"
          signUpUrl="/#/sign-up"
          withSignUp={false}
        />
      </div>
    </PageWrapper>
  );
}