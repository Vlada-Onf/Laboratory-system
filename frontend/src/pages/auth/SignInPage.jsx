import { SignIn } from "@clerk/clerk-react";
import PageWrapper from '../../components/layout/PaperWrapper';

export default function SignInPage() {
  return (
    <PageWrapper>
        <div style={{ display: "flex", justifyContent: "center", marginTop: 40 }}>
      <SignIn />
        </div>
    </PageWrapper>
  );
}
