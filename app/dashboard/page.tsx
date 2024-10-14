import { lusitana } from "../ui/fonts";
import { Card } from "../ui/dashboard/cards";
import { fetchLatestInvoices, fetchRevenue, fetchCardData } from "@/app/lib/data";
import RevenueChart from "../ui/dashboard/revenue-chart";
import LatestInvoices from "../ui/dashboard/latest-invoices";
import Breadcrumbs from "../ui/invoices/breadcrumbs";

export default async function Page(){
    const revenue = await fetchRevenue();
    const latestInvoices = await fetchLatestInvoices();
    const {numberOfInvoices, 
           totalPendingInvoices,
           totalPaidInvoices, 
           numberOfCustomers} = await fetchCardData();
    return (
        
        <main>
            <h1 className={`${lusitana.className} mb-8 text-xl md:text-2x1`}>
                Dashboard
            </h1>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
               <Card title="Collected" value={totalPaidInvoices} type="collected"/>
               <Card title="Pending" value={totalPendingInvoices} type="pending"/>  
               <Card title="Total Invoices" value={numberOfInvoices} type="invoices"/>
               <Card
                  title="Total Customers"
                  value={numberOfCustomers}
                  type="customers"    
               />


            </div>

            <div className="mt-6 grid gri-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
                <RevenueChart revenue={revenue}/>
                <LatestInvoices latestInvoices={latestInvoices}/>

            </div>
        </main>
    )
}