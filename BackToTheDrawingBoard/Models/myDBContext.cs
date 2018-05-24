using System;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using BackToTheDrawingBoard.Models;

namespace BackToTheDrawingBoard.Models
{
    public partial class MyDBContext : IdentityDbContext<User>
    {
        public virtual DbSet<Canvas> Canvas { get; set; }
       public virtual DbSet<CanvasUser> CanvasUser { get; set; }
        public virtual DbSet<LoginTable> LoginTable { get; set; }
        public virtual DbSet<UserTypeTable> UserTypeTable { get; set; }

        public MyDBContext(DbContextOptions<MyDBContext> options)
   : base(options)
        { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<Canvas>(entity =>
            {
                entity.Property(e => e.Name)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.String).IsUnicode(false);
            });

            modelBuilder.Entity<CanvasUser>(entity =>
            {
                entity.ToTable("Canvas-User");

                entity.Property(e => e.CanvasId).HasColumnName("canvasId");

                entity.Property(e => e.UserId)
                    .IsRequired()
                    .HasColumnName("userId")
                    .HasMaxLength(256)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<LoginTable>(entity =>
            {
                entity.Property(e => e.Login)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.UserType).HasDefaultValueSql("((0))");

                entity.HasOne(d => d.UserTypeNavigation)
                    .WithMany(p => p.LoginTable)
                    .HasForeignKey(d => d.UserType)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_LoginTable_ToUserTypeTable");
            });

            modelBuilder.Entity<UserTypeTable>(entity =>
            {
                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(10);
            });
        }

        public DbSet<BackToTheDrawingBoard.Models.User> User { get; set; }
    }
}
