
'use server';

import { sql } from '@vercel/postgres';
import {z} from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const formSchema = z.object({
    id: z.string(),
    customerId: z.string(),
    amount: z.coerce.number().min(0).max(2000000000),
    status: z.enum(['pending', 'paid']),
    date: z.string(),
});

const validatingInvoice = formSchema.omit({id: true, date: true})

export async function createInvoice(formData: FormData){
    const {customerId, amount, status}=  validatingInvoice.parse({
        customerId : formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'), 
  
    });
    const amountInCents = amount * 100;
    const date = new Date().toISOString().split('T')[0];

    await sql`
     INSERT INTO invoices (customer_id, amount, status, date) 
     VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;

    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}

const atualizaInvoice = formSchema.omit({id:true, date: true});
export async function updateInvoice(id: string, formData: FormData){
    const {customerId, amount, status} = atualizaInvoice.parse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    })

    const amountInCents = amount * 100;

    await sql`
      UPDATE invoices
      SET customer_id = ${customerId}, amount = ${amount},
      status = ${status} where id = ${id}
    `;

    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string){
    await sql`DELETE FROM invoices where id = ${id}`;
    revalidatePath('/dashboard/invoices')
}