import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';


function DynamicCustomerPage() {
  const { email } = useParams();
  const [pageContent, setPageContent] = useState("");

  useEffect(() => {
    const fetchCustomerPage = async () => {
      try {
        const response = await fetch(`http://localhost:5000/customer-pages/${email}`);

        if (!response.ok) {
          throw new Error("Customer page not found");
        }

        const content = await response.text();
        setPageContent(content);
      } catch (error) {
        setPageContent(`<div>Error: ${error.message}</div>`);
      }
    };

    fetchCustomerPage();
  }, [email]);

  return (
    <div dangerouslySetInnerHTML={{ __html: pageContent }} />
  );
}

export default DynamicCustomerPage;
