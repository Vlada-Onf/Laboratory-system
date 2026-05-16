import { SignUp } from "@clerk/clerk-react";
import PageWrapper from '../../components/layout/PaperWrapper';

export default function SignUpPage() {
  return (
    <PageWrapper>
      <div style={{ display: "flex", justifyContent: "center", marginTop: 40 }}>
        <SignUp
          routing="virtual"

          fallbackRedirectUrl="/#/front-main"
          forceRedirectUrl="/#/front-main"

          signInUrl="/#/sign-in"
        />
      </div>
    </PageWrapper>
  );
}