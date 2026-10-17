import {PayboxClient} from '@paybox-sh/sdk';
const merchant=process.env.VEYRA_MERCHANT_URL,credentialId=process.env.PAYBOX_CREDENTIAL_ID;
if(!merchant||!credentialId)throw new Error('Configure VEYRA_MERCHANT_URL and PAYBOX_CREDENTIAL_ID. Authenticate with the PayBox CLI.');
const url=new URL(merchant);if(url.protocol!=='https:')throw new Error('Merchant must use HTTPS.');url.searchParams.set('pack','holo');
// Actual Node SDK surface. The installed plugin is preferred: it provides a native capped proposal.
const client=PayboxClient.fromConfig();
const result=await client.useService({credentialId,url:url.toString(),method:'GET'},{waitForApproval:true});
console.log(JSON.stringify(result.response,null,2));
console.error('Inspect the request status and paid-service response. A pending snapshot is not settlement. Do not rerun to poll.');
