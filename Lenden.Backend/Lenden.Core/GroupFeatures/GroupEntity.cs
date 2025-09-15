namespace Lenden.Core.GroupFeatures;

public class GroupEntity
{
    protected GroupEntity()
    {
        
    }
    public GroupEntity(string name, string imageUrl)
    {
        Name = name;
        ImageUrl = imageUrl;
    }
    
    public int Id { get; set; }
    public string Name { get; set; }
    public string ImageUrl { get; set; }
}