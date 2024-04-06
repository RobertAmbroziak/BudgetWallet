﻿namespace Model.Application
{
    public class PostSplit
    {
        public int Id { get; set; }
        public int CategoryId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal Value { get; set; }
        public bool IsActive { get; set; }
    }
}
