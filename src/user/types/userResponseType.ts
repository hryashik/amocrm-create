export type UserResponseType = {
   _page: number
   _links: {
     self: {
       href: string
     }
   }
   _embedded: {
     contacts: Array<{
       id: number
       name: string
       first_name: string
       last_name: string
       responsible_user_id: number
       group_id: number
       created_by: number
       updated_by: number
       created_at: number
       updated_at: number
       closest_task_at: any
       is_deleted: boolean
       is_unsorted: boolean
       custom_fields_values: Array<{
         field_id: number
         field_name: string
         field_code: string
         field_type: string
         values: Array<{
           value: string
           enum_id: number
           enum_code: string
         }>
       }>
       account_id: number
       _links: {
         self: {
           href: string
         }
       }
       _embedded: {
         tags: Array<any>
         companies: Array<any>
       }
     }>
   }
 }