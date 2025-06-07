import React from "react";
import { MacbookScroll } from "../../UiComponents/macbook-scroll";
import Layout from "../layout/Layout";

export function MacbookScrollDemo() {
  return (
    <Layout>
 <div className="overflow-hidden dark:bg-[#0B0B0F] bg-white w-full">
      <MacbookScroll
        title={
          <span>
            This Macbook is built with Tailwindcss. <br /> No kidding.
          </span>
        }
        badge={
          <a href="https://softgamestudio.web.app" target="_blank" rel="noopener noreferrer">
            <Badge className="h-10 w-10 transform -rotate-12 rounded-full" />
          </a>
        }
        src={`https://lh3.googleusercontent.com/p/AF1QipOasYTOWOHPbmYzOChjcmXEICbS8Z8jtjaYH7hi=w284-h160-k-no`}
        showGradient={false} />
    </div>
    </Layout>
   
  );
}
// Peerlist logo
const Badge = ({
  className
}) => {
  return (
    <img width="24"
      height="24"
     className={className} viewBox="0 0 56 56" src="https://firebasestorage.googleapis.com/v0/b/webjl26.appspot.com/o/Designer.png?alt=media&token=3e6ee22e-f7f7-4d73-8ce7-0b1441ed3050" alt=""  />
    
  );
};
