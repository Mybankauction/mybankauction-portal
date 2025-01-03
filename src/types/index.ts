export type Data = {
  Owner: Owner
  Property_Video: any
  Bid_Increment_Amount: any
  Name_of_the_Borrower: any
  Un_Divided_Share_of_Land: any
  Furnishing: any
  Last_Activity_Time: any
  Asset_Category: string
  state: string
  Auction_start_date: string
  Auction_end_date: string
  Download_sales_notice: string
  property_visit_start_date: any
  process_flow: boolean
  Auction_Start: string
  Street: any
  locked_for_me: boolean
  Construction_Date: any
  North_By: any
  id: string
  Toilet_Indian: any
  approved: boolean
  Status: any
  Property_Facing: any
  approval: Approval
  Car_Parking: any
  Balcony: any
  South_by: any
  Auction_Type: string
  Landmark: any
  East_by: any
  Lift_Availability: any
  Borrower_Name: string
  editable: boolean
  Property_Type: string
  City: string
  Last_date_to_submit_the_tender_form_for_theauction: any
  Auction_End: string
  Nature_of_Possession: any
  No_of_units: any
  Flat_house_number: any
  Bank_account_in_which_Emd_to_be_remitted: any
  Location_Link: any
  Branch_Name: string
  Area: string
  Super_built_up_area: any
  Kitchen: any
  State: string
  Earnest_Money_Deposit: string
  Date_and_time_of_online_offer_opening: any
  zia_owner_assignment: string
  Toilet_Western: any
  is_duplicate: boolean
  Reserve_price: string
  Property_Address: any
  Auction_Platform_Link: any
  Sub_End: string
  review_process: ReviewProcess
  Pin_Code: any
  Property_Inside_Views: any
  Carpet_Area_sq_ft: any
  Record_Image: any
  review: any
  Service_Provider: string
  Property_visit_end_date: any
  Bedroom: any
  Property_Floor_Number: any
  Power_Backup: any
  Account_Name: string
  Date_of_Auction: any
  Property_Outside_Views: any
  Total_number_of_Floors: any
  bhk: any
  West_by: any
  Auction_id: string
  sale_notice: string
  orchestration: any
  Market_Price_of_Property: any
  Guarantor_Name_s: any
  Guarantor_Address_s: any
  Bank_Name: string
  in_merge: boolean
  Lender_Name: any
  Contact_Details: string
  Locked__s: boolean
  Tag: any[]
  Hall: any
  Total_area_sq_ft1: any
  approval_state: string
}

export type Owner = {
  name: string
  id: string
  email: string
}

export type Approval = {
  delegate: boolean
  takeover: boolean
  approve: boolean
  reject: boolean
  resubmit: boolean
}

export type ReviewProcess = {
  approve: boolean
  reject: boolean
  resubmit: boolean
}

// export type Area = {
//   name: string
//   id: string
// }
